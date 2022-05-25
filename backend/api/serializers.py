from pprint import pprint
from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password

class CreateAccountSerializer(serializers.ModelSerializer):

	class Meta:
		model = User
		fields = ['pseudo', 'email', 'phone', 'password']
		extra_kwargs = {
			'password': {'write_only': True},
		}

	def create(self, validated_data):
		pseudo = validated_data['pseudo']
		password = make_password(validated_data['password'])
		try:
			email = validated_data['email']
			newUser = User(pseudo=pseudo, email=email, password=password)
		except KeyError:
			phone = validated_data['phone']
			newUser = User(pseudo=pseudo, phone=phone, password=password)
		newUser.save()
		return newUser

class UserDetailSerializer(serializers.ModelSerializer):
	seniority = serializers.ReadOnlyField(source='getSeniority')

	class Meta:
		model = User
		fields = ['pseudo', 'email', 'phone', 'is_active', 'isAuthenticated', 'currency', 'seniority']