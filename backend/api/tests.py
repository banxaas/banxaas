from django.test import TestCase
import time
from .serializers import *


# Create your tests here.
class UserTestCase(TestCase):
    """
    def testPaymentMethod(self):
        user = User.objects.create(pseudo="pobar", email="papamatardiop3@gmail.com", password="pobarusama")
        pm = PaymentMethod.objects.create(user=user, name="WAVE", numero=769001942)
        serializer = UserDetailSerializer(user)
        print(serializer.typeOfPayments())
    """

    def testGetCurrentTrade(self):
        vendeur = User.objects.create(pseudo="pobar", email="papamatardiop3@gmail.com", password="pobarusama")
        acheteur = User.objects.create(pseudo="zlorg", email="pamatardiop1@gmail.com", password="pobarusama")
        ad1 = Ad.objects.create(user=vendeur, sens="V", quantityType="F", quantityFixe="1", amountType="F", amountFixe="12000000", marge=1, provider="WAVE", status="C")
        trade1 = Trade.objects.create(tradeHash="rtyuia54678fdghjk", walletAddress="rtyuia54678fdghjk23DD", trader=acheteur, ad=ad1)
        time.sleep(5)
        ad2 = Ad.objects.create(user=acheteur, sens="V", quantityType="F", quantityFixe="1", amountType="F", amountFixe="12000000", marge=1, provider="WAVE", status="C")
        trade2 = Trade.objects.create(tradeHash="rtyuia54678fdghjk", walletAddress="rtyuia54678fdghjk23DD", trader=vendeur, ad=ad2)
        print(vendeur.get_current_trade())
        print(acheteur.get_current_trade())


