from django.urls import path

from .viewsets import *

urlpatterns = [
    path('connexion/', ConnexionViewset.as_view()),
    path('connexionRoomName/', ConnexionRoomName.as_view()),
    path('disconnect/', Disconnect.as_view()),
    path('createAccount/', CreateAccountViewset.as_view()),
    path('validateCode/', ValidateCodeViewset.as_view()),
    path('sendNewCodeValidation/', SendValidationCode.as_view()),
    path('user/', UserViewset.as_view()),
    path('paymentMethod/', PaymentMethodViewset.as_view()),
    path('ad/', AdViewset.as_view()),
    path('ads/<int:page>/', AdsViewset.as_view()),
    # path('trades/' Trade)
    path('trade/init/', InitTradeViewset.as_view()),
    path('trade/<str:tradeHash>/', TradeViewset.as_view()),
    path('deleteInactiveAccounts/', DeleteInactiveAccounts.as_view()),
    path('transactions/<int:page>', TransactionsViewset.as_view()),
    path('transactions/<str:tradeHash>', TransactionViewset.as_view()),
]
