from pprint import pprint
from rest_framework import serializers
from .models import *
import hashlib

class CreateAccountSerializer(serializers.ModelSerializer):

	class Meta:
		model = User
		fields = ['pseudo', 'email', 'phone', 'password']
		extra_kwargs = {
			'password': {'write_only': True},
		}

	def create(self, validated_data):
		pseudo = validated_data['pseudo']
		email = validated_data['email']
		phone = validated_data['phone']
		password = hashlib.sha256(validated_data['password'].encode('utf-8')).hexdigest()
		newUser = User(pseudo=pseudo, email=email, phone=phone, password=password)
		newUser.save()
		return newUser
