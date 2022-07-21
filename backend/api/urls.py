from django.urls import path

from .viewsets import *

urlpatterns = [
    path('connexion/', Connexion.as_view()),
    path('createAccount/', CreateAccountViewset),
    path('validateCode/', ValidateCodeViewset),
    path('isDisconnected/', isDisconnected),
    path('setUser/', SetUserViewset),
    path('paymentMethod/', PaymentMethodViewset.as_view()),
    path('ad/', AdViewset.as_view()),
    path('ads/<int:page>/', AdsViewset.as_view()),
    #path('trades/' Trade)
    path('trade/init/', InitTrade)
]
