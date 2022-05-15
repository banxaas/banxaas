from django.urls import path, include
from .models import User
from rest_framework import routers
from .viewsets import *


urlpatterns = [
    path('connexion/', Connexion),
    path('createAccount/', CreateAccountViewset.as_view()),
    path('validateCode/', ValidateCodeViewset.as_view()),
    path('isDisconnected/', isDisconnected),
]
