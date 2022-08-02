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
