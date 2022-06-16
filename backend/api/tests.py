from django.test import TestCase

from .serializers import *


# Create your tests here.
class UserTestCase(TestCase):
    def testPaymentMethod(self):
        user = User.objects.create(pseudo="pobar", email="papamatardiop3@gmail.com", password="pobarusama")
        pm = PaymentMethod.objects.create(user=user, name="WAVE", numero=769001942)
        serializer = UserDetailSerializer(user)
        print(serializer.typeOfPayments())
