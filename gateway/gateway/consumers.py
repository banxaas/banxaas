# chat/consumers.py
import json
from channels.generic.websocket import WebsocketConsumer


class ConnexionConsumer(WebsocketConsumer):
    def connect(self):
        print("Connecté")
        self.accept()

    def disconnect(self, close_code):
        print("Deconnecté")

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json)
        message = text_data_json['message']

        self.send(text_data=json.dumps({
            'message': message
        }))
