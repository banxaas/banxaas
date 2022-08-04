from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('ws/connexion/', consumers.ConnexionConsumer.as_asgi()),
    path('ws/transaction/<str:tradeHash>/',
         consumers.TransactionConsumer.as_asgi()),
]
