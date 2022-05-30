from django.test import TestCase
from datetime import datetime
from .models import *

# Create your tests here.
class UserTestCase(TestCase):
    def testPaymentMethod(self):
        user = User.objects.create(pseudo="pobar", email="papamatardiop3@gmail.com", password="pobarusama")
        print(user.getPaymentMethods())
