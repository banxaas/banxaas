from django.db import models
from datetime import datetime, timezone
from pprint import pprint

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, pseudo, password, **extra_fields):
        """
        Create and save a User with the given pseudo and password.
        """
        user = self.model(pseudo=pseudo, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, pseudo, password, **extra_fields):
        """
        Create and save a SuperUser with the given pseudo and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(pseudo, password, **extra_fields)


# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):
	#Enum Variable
	CURRENCY_VALUE = [("CFA", "CFA"), ("USD", "USD"), ("EUR", "EUR")]
	# Personnal Info
	pseudo = models.CharField(max_length=30, unique=True)
	email = models.EmailField(_('email address'), unique=True, blank=True, null=True)
	phone = models.CharField(max_length=14, unique=True, blank=True, null=True)

	# Others Info
	isAuthenticated = models.BooleanField(default=False) #readOnly
	is_staff = models.BooleanField(default=False) #readOnly
	is_active = models.BooleanField(default=False)
	date_joined = models.DateTimeField(auto_now_add=True)
	last_login = models.DateTimeField(null=True, blank=True)
	currency = models.CharField(max_length=50, default="CFA", choices=CURRENCY_VALUE)

	# Config User
	USERNAME_FIELD = 'pseudo'
	REQUIRED_FIELDS = []
	objects = CustomUserManager()

	def __str__(self):
		return self.pseudo

	def connect(self):
		self.isAuthenticated = True
		self.last_login = datetime.now(timezone.utc)

	def disconnect(self):
		self.isAuthenticated = False

	def getSeniority(self):
		seniority = datetime.now(timezone.utc) - self.date_joined
		seniority = seniority.total_seconds()
		if (seniority < 60):
			seniority = "Moins d'une minute"
		elif (60 < seniority < 3600):
			seniority = str(int(seniority//60)) + " minute(s)"
		elif(3600<seniority<86400):
			seniority = str(int(seniority//3600)) + " heure(s)"
		return seniority

	def getPaymentMethods(self):
		return [pm for pm in PaymentMethod.objects.filter(user=self)]


class PaymentMethod(models.Model):
	#Enum Payment Method
	PAYMENT_METHOD = [("WAVE", "Wave"), ("OM", "Orange Money"), ("FREE","Free Money")]

	user = models.ForeignKey(User, related_name="pms", on_delete=models.CASCADE)
	name = models.CharField(max_length=15, choices=PAYMENT_METHOD)
	numero = models.IntegerField()

	def __str__(self):
		return self.name + " | " + str(self.user)

class Ad(models.Model):
	provider = models.ForeignKey(User, on_delete=models.CASCADE)
	counterParty = models.IntegerField()
	status = models.CharField(max_length=50)
	sens = models.CharField(max_length=50)
	quantityType = models.CharField(max_length=50)
	quantityValue = models.IntegerField()
	amountType = models.CharField(max_length=40)
	amountValue = models.IntegerField()
	publicationDate = models.DateTimeField()
	margin = models.IntegerField()

class Trade(models.Model):
	trader = models.ForeignKey(User, on_delete=models.CASCADE)
	provider = models.ForeignKey(Ad, on_delete=models.CASCADE)
	startingDate = models.DateTimeField()
	steps = models.CharField(max_length=40)
