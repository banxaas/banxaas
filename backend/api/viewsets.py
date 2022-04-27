from pprint import pprint
import time
from rest_framework import viewsets, generics, mixins, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import *
from .models import *
from api.repository.connexionRepository import *
import hashlib

@api_view(['POST'])
def connexion(request):
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
	# password = hashlib.sha256(password.encode('utf-8')).hexdigest()
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
		'token': createToken(idHash)
	})

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
