# chat/consumers.py
import json
import time
from pprint import pprint
import requests
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class ConnexionConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.time = time.time()

    def disconnect(self, close_code):
        print("Deconnecté")

    def receive(self, text_data):
        try:
            data = json.loads(text_data)
            data = {"token": data['token'], "signature": data['signature']}
            request = requests.post(
                'http://backend:27543/api/connexionRoomName/', data=data).json()
            status = request['status']

            if status == "FAILED":
                self.send(text_data=json.dumps({'message': "FAILED"}))
                self.close(code=4004)
            else:
                self.room_group_name = request['room_name']
                async_to_sync(self.channel_layer.group_add)(
                    self.room_group_name,
                    self.channel_name
                )
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        'sender': str(self.time),
                        'type': 'chat_message',
                        'message': "nc"
                    }
                )
                self.send(text_data=json.dumps({
                    'message': "En attente d'une nouvelle connexion !"
                }))

        except:
            self.send(text_data=json.dumps({'message': "FAILED"}))
            self.close(code=4004)

    def chat_message(self, event):
        if str(self.time) != event['sender']:
            if event['message'] == "nc":
                self.send(text_data=json.dumps({
                    'message': 'Nouvelle Connexion !'
                }))
                self.close(code=4004)


class TransactionConsumer(WebsocketConsumer):

    def connect(self):
        self.tradeHash = self.scope["url_route"]["kwargs"]["tradeHash"]
        # Je dois aussi vérifier les tokens à faire plus tard et identifier l'acteur qui entre en jeu
        # Vérifier le nombre d'acteur dans le group channel
        request = requests.get(
            f'http://backend:27543/api/trade/{self.tradeHash}/')
        if request.json()['status'] == "SUCCESSFUL":
            self.room_group_name = self.tradeHash
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )
            self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        data = json.loads(text_data)
        keys = list(data.keys())
        token = data['token']
        signature = data['signature']
        tradeId = data['tradeId']
        if (len(keys) == 3) and ('token' in keys) and ('signature' in keys) and ('tradeId' in keys):
            data_ = {'token':token, 'signature':signature, 'tradeId':tradeId}
            request = requests.post(f'http://backend:27543/api/trade/{self.tradeHash}/', data=data_)
            if request.json()['status'] == 'FAILED':
                pprint(request.json()['message'])
                self.close(code=4004)
            else:
                self.role = request.json()['role']
                self.send(text_data=json.dumps({
                    'type': 'verification',
                    'trade': request.json()['trade']
                }))
                pprint(self.role)
        else:
            step = data['step']
            data_ = {'token':token, 'signature':signature, 'tradeId':tradeId}
            request = requests.post(f'http://backend:27543/api/trade/{self.tradeHash}/', data=data_)
            if request.json()['status'] == 'FAILED':
                pprint(request.json()['message'])
                self.close(code=4004)
            else:
                self.role = request.json()['role']

            if (self.role == "Vendeur" and (step == 2 or step == 4)) or (self.role == "Acheteur" and (step==3 or step==5)):
                data_ = {'token':token, 'signature':signature, 'step':step, 'tradeId':tradeId, 'role':self.role}
                if step == 2:
                    data_['txId'] = data['txId']
                if step == 3:
                    data_['transactionId'] = data['transactionId']
                if step == 5:
                    data_['buyerWalletAdress'] = data['buyerWalletAdress']
                request = requests.patch(f'http://backend:27543/api/trade/{self.tradeHash}/', data=data_)
                if request.json()['status'] == "SUCCESSFUL":
                    async_to_sync(self.channel_layer.group_send)(
                        self.room_group_name,
                        {
                            'step': step,
                            'type': 'chat_message',
                            'message': "nc"
                        }
                    )
                else:
                    pprint(request.json()['message'])
                    self.close(code=4004)
            else:
                self.send(text_data=json.dumps({
                    "message":"Cette action ne vous correspond pas!"
                }))
                self.close(code=4004)

    def chat_message(self, event):
        self.send(text_data=json.dumps({
            'type': 'trade',
            'step': event['step']
        }))
