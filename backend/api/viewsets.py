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


@api_view(['POST'])
def Connexion(request):
	# Vérification des données collectées depuis le front-end
	try:
		[login, password] = isRequestDataConnexionValid(request.data)
	except TypeError:
		return Response({'status': "FAILED", 'message': "Identifiants Incorrects"})
	# Vérification de l'existence du Login (pseudo, email, telephone)
	user = getUserByLogin(login)
	if not user:
		return Response({'status': "FAILED", 'message': "Identifiants Incorrects"})
	# Vérification de la conformité du mot de passe
	password = hashlib.sha256(password.encode('utf-8')).hexdigest()

	if (password != user.password):
		return Response({'status': "FAILED", 'message': "Identifiants Incorrects"})

	if not user.isActive:
		return Response({'status': 'INACTIVATED', 'message': 'Votre compte n\'a pas été activé'})
	user.connect()
	user.save()
	idHash = hashlib.sha256(str(user.id).encode('utf-8')).hexdigest()
	return Response({
		'status': "SUCCESSFUL",
		'isActive': user.isActive,
		'tokenId': createToken(idHash)
	})


class CreateAccountViewset(mixins.CreateModelMixin, generics.GenericAPIView):
	
	def post(self, request, format=None):		
		# Vérification spécification

		# Vérification spécification
		userExist, response = verifyUser(request.data['pseudo'], request.data['email'], request.data['phone'])
		pprint(userExist)
		if userExist:
			return response
		serializer = CreateAccountSerializer(data=request.data)
		if not serializer.is_valid():
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		serializer.save()
		email = request.data['email']
		code = sendVerificationCode(email)
		payload = createValidationTokenPayload(code, email)
		return Response({
			'status': "SUCCESSFUL",
 			'tokenId': createToken(payload),
		})


class ValidateCodeViewset(mixins.CreateModelMixin, generics.GenericAPIView):
	
	def post(self, request, format=None):
		isValid, email = verifyCodeValidation(request.data['code'], request.data['tokenId'])
		if not isValid:
			return Response({'status': "FAILED", 'message': 'Invalide Code'})
		user = User.objects.filter(email=email)[0]
		user.isActive = True
		user.save()
		return Response({'status': "SUCCESSFUL"})

"""
fetch('http://localhost:8000/api/connexion/',
	{
		method: 'POST',
	    body: JSON.stringify({
		    login: "zlorg",
		    password: "pobarito"
		})
	}
).then(response => response.json()).then(response => response)
"""
