from django.test import TestCase
from datetime import datetime
from .models import User

# Create your tests here.
class UserTestCase(TestCase):
    def testSeniority(self):
        user1 = User.objects.create(pseudo="pobar", email="papamat@gmail.com", phone="+221777023861", lastLogin=datetime.now())
        print(user1.getSeniority())
