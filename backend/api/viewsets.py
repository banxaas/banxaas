import loguru
from pprint import pprint
import time
import jwt
from datetime import datetime, timezone, timedelta
from rest_framework import viewsets, generics, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import *
from .models import *
from api.repository.connexionRepository import *
from api.repository.createAccountRepository import *
import hashlib
from django.contrib.auth.hashers import make_password
from rest_framework.authtoken.models import Token
import re


@api_view(['POST'])
def Connexion(request):
	# Vérification des données collectées depuis le front-end
	try:
		[login, password] = isRequestDataConnexionValid(request.data)
	except TypeError:
		return Response({'status': "FAILED", 'message': "Identifiants Incorrects"})
	# Vérification de l'existence du user (pseudo, email, telephone)
	user = getUserByLogin(login)
	if ((not user) or (not user.check_password(password))):
		return Response({'status': "FAILED", 'message': "Identifiants Incorrects"})

	if not user.is_active:
		return Response({'status': 'INACTIVATED', 'message': 'Votre compte n\'a pas été activé'})

	if user.isAuthenticated:
		user.disconnect()
		pprint("Déconnecté avec succès !")

	key = hashlib.sha256((str(user.id) + str(user.pseudo)).encode('utf-8')).hexdigest()
	iat = datetime.now(timezone.utc)
	exp = iat + timedelta(seconds=72000)
	payload = {'sub':user.pseudo, 'iat': iat, 'exp':exp}
	token = createToken(payload)

	if Token.objects.filter(user=user):
		Token.objects.filter(user=user)[0].delete()
	signature = Token.objects.create(user=user)
	user.connect()
	user.save()
	serializer = UserDetailSerializer(user)
	return Response({
		'status': "SUCCESSFUL",
		'user': serializer.data,
		'key': user.pseudo + ':' + key,
		'token': token,
		'signature': signature.key
	})


class CreateAccountViewset(mixins.CreateModelMixin, generics.GenericAPIView):
	
	def post(self, request, format=None):
		data = request.data
		keys = list(data.keys())
		if (len(keys) != 3) or ('pseudo' not in keys) or ('password' not in keys) or (('phone' not in keys) and ('email' not in keys)):
			return Response({'status': 'FAILED'})
		if 'email' in keys:
			email = data['email']
			emailRegex = "([A-Za-z0-9]+[._-]?)*[A-Za-z0-9]+@([A-Za-z0-9]+[._-]?)*[A-Za-z0-9]+\\.([A-Z|a-z]{2,})"
			if(not re.match(emailRegex, email)):
				return Response({'status': 'Email Invalide'})
			userExist, response = verifyUser(data['pseudo'], email)
		else:
			phone =  data['phone']
			phoneRegex = "^(77|78|75|70|76)[0-9]{7}$"
			if(not re.match(phoneRegex, phone)):
				return Response({'status': 'Phone Invalide'})
			userExist, response = verifyUser(data['pseudo'], data['phone'])
		if userExist:
			return response
		serializer = CreateAccountSerializer(data=data)
		if not serializer.is_valid():
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		serializer.save()
		if 'email' in keys:
			code = sendVerificationCodeByMail(email)
			payload = createValidationTokenPayload(code, email, "email")
		else:
			code = sendVerificationCodeBySms(phone)
			payload = createValidationTokenPayload(code, phone, "phone")
		return Response({
			'status': "SUCCESSFUL",
 			'token': createToken(payload)
		})

class ValidateCodeViewset(mixins.CreateModelMixin, generics.GenericAPIView):
	
	def post(self, request, format=None):
		isValid, userId = verifyCodeValidation(request.data['code'], request.data['token'])
		if not isValid:
			return Response({'status': "FAILED", 'message': 'Invalide Code'})
		if User.objects.filter(email=userId):
			user = User.objects.filter(email=userId)[0]
		if User.objects.filter(phone=userId):
			user = User.objects.filter(phone=userId)[0]
		user.is_active = True
		user.save()
		return Response({'status': "SUCCESSFUL"})


@api_view(['POST'])
def isDisconnected(request):
	key = str(request.data['key'])
	pseudo = key.split(':')[0]
	key = key.split(':')[1]
	if User.objects.filter(pseudo=pseudo):
		user = User.objects.filter(pseudo=pseudo)[0]
		userKey = hashlib.sha256((str(user.id) + str(user.pseudo)).encode('utf-8')).hexdigest()
		if key == userKey:
			while True:
				signature = Token.objects.filter(user=user)[0]
				pprint(signature)
				if request.data['signature'] != signature.key:
					break
				time.sleep(10)
			return Response({'status': True})
	return Response({'status': 'FAILED'})
