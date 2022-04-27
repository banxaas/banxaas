from django.db import models
from datetime import datetime, timezone
from pprint import pprint

# Create your models here.
class User(models.Model):
	pseudo = models.CharField(max_length=30)
	password = models.CharField(max_length=32)
	email = models.EmailField(max_length=50)
	phone = models.CharField(max_length=15)
	creationDate = models.DateTimeField(auto_now_add=True)
	lastLogin = models.DateTimeField()
	isAuthenticated = models.BooleanField(default=True)
	isActive = models.BooleanField(default=True)

	def __str__(self):
		return self.pseudo

	def connect(self):
		self.isAuthenticated = True
		self.lastLogin = datetime.now()

	def disconnect(self):
		self.isAuthenticated = false
		return isAuthenticated

	def getSeniority(self):
		seniority = datetime.now(timezone.utc) - self.creationDate
		seniority = seniority.total_seconds()
		if (seniority < 60):
			seniority = "Moins d'une minute"
		elif (60 < seniority < 3600):
			seniority = seniority%60 + " minutes"
		return seniority
