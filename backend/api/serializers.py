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

class SetAccountSerializer(serializers.ModelSerializer):

	class Meta:
		model = User
		fields = ['pseudo', 'email', 'phone', 'currency']

	def update(self, instance, validated_data):
		instance.pseudo = validated_data.get('pseudo', instance.pseudo)
		instance.phone = validated_data.get('phone', instance.phone)
		instance.email = validated_data.get('email', instance.email)
		instance.currency = validated_data.get('currency', instance.currency)
		instance.save()
		return instance

class PaymentMethodSerializer(serializers.ModelSerializer):
	class Meta:
		model = PaymentMethod
		fields = ['user', 'name', 'phone']

class PaymentMethodForConnSerializer(serializers.ModelSerializer):
	class Meta:
		model = PaymentMethod
		fields = ['id', 'name', 'phone']

class UserDetailSerializer(serializers.ModelSerializer):
	seniority = serializers.ReadOnlyField(source='getSeniority')
	#paymentMethods = serializers.ReadOnlyField(source='getPaymentMethods')
	paymentMethods = PaymentMethodForConnSerializer(many=True, source='getPaymentMethods')

	class Meta:
		model = User
		fields = ['pseudo', 'email', 'phone', 'is_active', 'isAuthenticated', 'currency', 'seniority', 'paymentMethods']
		depth = 1

class UserForAdSerializer(serializers.ModelSerializer):
	seniority = serializers.ReadOnlyField(source='getSeniority')
	class Meta:
		model = User
		fields = ['pseudo', 'seniority']

class AdPostSerializer(serializers.ModelSerializer):
    quantityFixe = serializers.CharField(allow_blank=True, required=False)
    quantityMin = serializers.CharField(allow_blank=True, required=False)
    quantityMax = serializers.CharField(allow_blank=True, required=False)
    amountFixe = serializers.CharField(allow_blank=True, required=False)
    amountMin = serializers.CharField(allow_blank=True, required=False)
    amountMax = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = Ad
        fields = '__all__'

class AdGetSerializer(serializers.ModelSerializer):
    user = UserForAdSerializer()

    class Meta:
        model = Ad
        fields = '__all__'
        depth = 1


"""
class AdsSerializer(serializers.ModelSerializer):

	class Meta:
		model = Ad
		fields = '__all__'
		extra_kwargs = {
			'publicationDate': {'read_only': True},
		}
"""