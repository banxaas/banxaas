import loguru
from pprint import pprint
import time
import jwt
from datetime import datetime, timezone, timedelta
from rest_framework import viewsets, generics, mixins, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import *
from .models import *
from api.repository.connexionRepository import *
from api.repository.createAccountRepository import *
import hashlib
from django.contrib.auth.hashers import make_password
from rest_framework.authtoken.models import Token


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
	return Response({
		'status': "SUCCESSFUL",
		'isActive': user.is_active,
		'key': user.pseudo + ':' + key,
		'token': token,
		'signature': signature.key
	})


class CreateAccountViewset(mixins.CreateModelMixin, generics.GenericAPIView):
	
	def post(self, request, format=None):
		data = request.data
		keys = list(data.keys())
		if (len(keys) == 3) and ('pseudo' in keys) and ('password' in keys) and (('phone' in keys) or ('email' in keys)):
			if 'email' in keys:
				userExist, response = verifyUser(data['pseudo'], data['email'])
				if userExist:
					return response
				serializer = CreateAccountSerializer(data=data)
				if not serializer.is_valid():
					return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
				serializer.save()
				email = request.data['email']
				code = sendVerificationCode(email)
				payload = createValidationTokenPayload(code, email)
			else:
				userExist, response = verifyUser(data['pseudo'], data['phone'])
				if userExist:
					return response
				return Response({
					'status': "INDISPONIBLE",
		 			#'tokenId': createToken(payload),
				})
			"""
			"""
			return Response({
				'status': "SUCCESSFUL",
	 			#'tokenId': createToken(payload),
			})

		else:
			return Response({'status': 'FAILED'})

class ValidateCodeViewset(mixins.CreateModelMixin, generics.GenericAPIView):
	
	def post(self, request, format=None):
		isValid, email = verifyCodeValidation(request.data['code'], request.data['tokenId'])
		if not isValid:
			return Response({'status': "FAILED", 'message': 'Invalide Code'})
		user = User.objects.filter(email=email)[0]
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
