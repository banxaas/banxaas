from django.urls import path, include
from .models import User
from rest_framework import routers
from .viewsets import *


urlpatterns = [
    path('connexion/', Connexion),
    path('createAccount/', CreateAccountViewset),
    path('validateCode/', ValidateCodeViewset),
    path('isDisconnected/', isDisconnected),
    path('setUser/', SetUserViewset),
    path('PaymentMethod/', PaymentMethodViewset.as_view()),
    path('ad/', AdViewset.as_view()),
    path('ads/<int:pk>/', AdsViewset.as_view())
]
