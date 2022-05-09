from django.db import models
from datetime import datetime, timezone
from pprint import pprint

# Create your models here.
class User(models.Model):
	pseudo = models.CharField(max_length=30, unique=True)
	password = models.CharField(max_length=256)
	email = models.EmailField(max_length=50, unique=True)
	phone = models.CharField(max_length=14, unique=True)
	creationDate = models.DateTimeField(auto_now_add=True)
	lastLogin = models.DateTimeField(blank=True, null=True)
	isAuthenticated = models.BooleanField(default=False) #readOnly
	isActive = models.BooleanField(default=False) #readOnly

	def __str__(self):
		return self.pseudo

	def connect(self):
		self.isAuthenticated = True
		self.lastLogin = datetime.now(timezone.utc)

	def disconnect(self):
		self.isAuthenticated = false

	def getSeniority(self):
		seniority = datetime.now(timezone.utc) - self.creationDate
		seniority = seniority.total_seconds()
		if (seniority < 60):
			seniority = "Moins d'une minute"
		elif (60 < seniority < 3600):
			seniority = seniority%60 + " minutes"
		return seniority
