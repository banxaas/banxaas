import os, hashlib, jwt, re, loguru, time
from pprint import pprint
from datetime import datetime, timezone, timedelta
from rest_framework.views import APIView
from rest_framework import viewsets, generics, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import *
from .models import *
from api.repository.authRepository import *
from django.contrib.auth.hashers import make_password
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
def Connexion(request):
	""" Cette fonction prend en charge de la connexion des utilisateurs.
	Methode autorisée: POST,
	JSON à soumettre: {
		"login": "...",
		"password": "..."
	}
	"""
	# Vérification de la validité des données collectées
	try:
		[login, password] = isRequestDataConnexionValid(request.data)
	except TypeError:
		return Response({'status': "FAILED", 'message': "Identifiants Incorrects"})

	# Vérification de l'existence du user (pseudo, email, telephone)
	user = getUserByLogin(login)
	if ((not user) or (not user.check_password(password))):
		return Response({'status': "FAILED", 'message': "Identifiants Incorrects"})

	# Vérification de l'état du compte de l'utilisateur
	if not user.is_active:
		return Response({'status': 'INACTIVATED', 'message': 'Votre compte n\'a pas été activé'})

	# Déconnexion de l'utilisateur s'il est connecté autre part
	if user.isAuthenticated:
		user.disconnect()

	if Token.objects.filter(user=user):
		Token.objects.filter(user=user)[0].delete()

	# Création du token JWT
	iat = datetime.now(timezone.utc)
	exp = iat + timedelta(seconds=72000)
	payload = {'sub':user.pseudo, 'iat': iat, 'exp':exp}
	jwt = createToken(payload) # Créer un nouvel Token JWT

	# Création du Token Signature de Connexion
	signature = Token.objects.create(user=user) #Permet d'identifier la connexion de l'utilisateur
	user.connect()
	user.save()

	# Sérialisation
	serializer = UserDetailSerializer(user)

	return Response({
		'status': "SUCCESSFUL",
		'user': serializer.data,
		'token': jwt,
		'signature': signature.key
	})

@api_view(['POST'])
def isDisconnected(request):
	""" Cette fonction permet de vérifier si l'utilisateur s'est connecté à nouveau
	pour le déconnecter
	Méthode autorisée: POST,
	JSON à soumettre: {
		"token": "...",
		"signature": "..."
	}
	Ces informations sont fournis lors de la connexion
	"""
	try:
		# Récupération de l'utilisateur
		user = User.objects.get(pseudo=jwt.decode(request.data['token'], os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
		# Boucle de vérification ( à voir si c'est performant ou pas)
		while True:
			# En attente de changement du token (c'est à dire, une nouvelle connexion)
			if request.data['signature'] != Token.objects.filter(user=user)[0].key:
				break
			time.sleep(10)
		return Response({'status': True})
	except:
		return Response({'status': 'FAILED'})

@api_view(['POST'])
def CreateAccountViewset(request):
	""" Cette fonction, permet de creer un compte utilisateur 
	Méthode autorisée: POST,
	JSON à soumettre: {'pseudo': '...', 'password': '...', 'email':'...'} ou
					  {'pseudo': '...', 'password': '...', 'phone':'...'}
	"""
	data = request.data
	keys = list(data.keys())
	# Vérification de la validité des données collectées
	if (len(keys) != 3) or ('pseudo' not in keys) or ('password' not in keys) or (('phone' not in keys) and ('email' not in keys)):
		return Response({'status': 'FAILED'})

	if 'email' in keys:
		# L'utilisateur a donné son email
		email = data['email']
		emailRegex = "([A-Za-z0-9]+[._-]?)*[A-Za-z0-9]+@([A-Za-z0-9]+[._-]?)*[A-Za-z0-9]+\\.([A-Z|a-z]{2,})"
		if(not re.match(emailRegex, email)): # Regex Email Vérification
			return Response({'status': 'Email Invalide'})
		userExist, response = verifyUser(email) # Vérification d'un potentiel utilisateur avec cet email
	else:
		#L'utilisateur a donné son phone
		phone =  data['phone']
		phoneRegex = "^(77|78|75|70|76)[0-9]{7}$" # Regex Phone Verification
		if(not re.match(phoneRegex, phone)):
			return Response({'status': 'Phone Invalide'})
		userExist, response = verifyUser(data['phone']) # Vérification d'un potentiel utilisateur avec ce mail
	if userExist:
		return response
	serializer = CreateAccountSerializer(data=data) # Sérialisation
	if not serializer.is_valid():
		return Response({'status': 'FAILED'})
	serializer.save()
	# Envoie du code de Vérification et Création du Payload JWT
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

@api_view(['POST'])
def ValidateCodeViewset(request):
	""" Cette fonction, permet de valider le code de l'utilisateur 
	Méthode autorisée: POST,
	JSON à soumettre: {'code': '...', 'token': '...'}
	"""
	try:
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
	except:
		return Response({'status': "FAILED"})
	

class PaymentMethodViewset(APIView):

	def verifyExistingPm(self, name, phone):
		""" Permet de vérifier si le PM existe déja """
		if PaymentMethod.objects.filter(name=name, phone=phone):
			return True
		return False

	def post(self, request):
		""" Permet d'ajouter une méthode de paiement
		Méthode: POST,
		JSON: {'token': '...', 'signature': '...', 'name':'...', 'phone': '...'}
		"""
		try:
			# Validité des éléments
			if len(request.data) != 4:
				return Response({'status': "FAILED"})
			token = request.data['token']

			# Vérifie si l'utilisateur est connecté
			if not isAuthenticated(token, request.data['signature']):
				return Response({"status": "FAILED"})
			
			# Verification existence PM
			if self.verifyExistingPm(request.data['name'], request.data['phone']):
				return Response({'status': "FAILED", "message": "Payment Method already exists!"})

			user = User.objects.get(pseudo=jwt.decode(token, os.environ.get('JWT_SECRET'), algorithms="HS256")['sub']).id # Récupération du User
			data = {'user':user, 'name':request.data['name'], 'phone':request.data['phone']}
			# Sérialisation
			serializer = PaymentMethodSerializer(data=data)
			if serializer.is_valid():
				serializer.save()
				return Response({'status': "SUCCESSFUL"})
		except:
			return Response({'status': "FAILED"})
		return Response({'status': "FAILED"})
		

	def delete(self, request):
		""" Permet de supprimer une méthode de paiement
		Méthode: POST,
		JSON: {'token': '...', 'signature': '...', 'id':'...'}
		"""
		try:
			# Validité des éléments
			if len(request.data) != 3:
				return Response({'status': "FAILED"})
			token = request.data['token']
			# Vérifie si l'utilisateur est connecté
			if not isAuthenticated(token, request.data['signature']):
				return Response({"status": "FAILED"})
			pm = PaymentMethod.objects.get(id=int(request.data['id']))
			pm.delete()
			return Response({'status': "SUCCESSFUL"})
		except Exception as e:
			return Response({'status': "FAILED"})

@api_view(['PATCH'])
def SetUserViewset(request):
	"""
	Permet de modifier les informations de l'utilisateurs
	Méthode: PATCH,
	JSON: {
		'token': '...', 
		'signature':'...', 
		'pseudo':'...', 
		'email':'...', 
		'password': '...', 
		'newPassword': '...', 
		'currency': '...'
	}
	"""
	try:
		data = request.data
		keys = list(data.keys())

		# Validité des éléments
		if len(data) > 7:
			return Response({'status': "FAILED"})

		token = data['token'] # Récupération du Token

		# Vérifie si l'utilisateur est connecté
		if not isAuthenticated(token, data['signature']):
			return Response({"status": "FAILED"})

		user = User.objects.get(pseudo=jwt.decode(token, os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
		
		# Vérifie si les nouvelles informations existent ou pas
		if ('pseudo' in keys) and (user.pseudo != data['pseudo']):
			pseudoExist, response = verifyUser(data['pseudo'])
			if pseudoExist:
				return response
		
		if ('email' in keys) and (user.email != data['email']):
			emailExist, response = verifyUser(data['email'])
			if emailExist:
				return response
			emailRegex = "([A-Za-z0-9]+[._-]?)*[A-Za-z0-9]+@([A-Za-z0-9]+[._-]?)*[A-Za-z0-9]+\\.([A-Z|a-z]{2,})"
			if not re.match(emailRegex, data['email']): # Regex Email Vérification
				return Response({'status': 'Email Invalide'})

		if ('phone' in keys) and (user.phone != str(data['phone'])):
			phoneExist, response = verifyUser(data['phone'])
			if phoneExist:
				return response
			phoneRegex = "^(77|78|75|70|76)[0-9]{7}$"
			if not re.match(phoneRegex, str(data['phone'])):
				return Response({'status': 'Phone Invalide'})

		if (('password' in keys) and ('newPassword' not in keys)) or (('newPassword' in keys) and ('password' not in keys)):
			return Response({"status":"FAILED"})
		
		if ('password' in keys) and ('newPassword' in keys):
			if user.check_password(data['password']):
				data['password'] = make_password(data['newPassword'])
				data.pop('newPassword')
			else:
				return Response({'status':"FAILED", 'message': "Mot de passe incorrect !"})

		# Nettoyage de data
		data.pop('token')
		data.pop('signature')

		#sérialisation
		serializer = SetAccountSerializer(user, data=data, partial=True)
		if serializer.is_valid():
			user.disconnect()
			Token.objects.filter(user=user)[0].delete()
			Token.objects.create(user=user)
			# Préparation des payload et envoie du code
			if ('email' in keys) or ('phone' in keys):
				if 'email' in keys:
					code = sendVerificationCodeByMail(data['email'])
					payload = createValidationTokenPayload(code, data['email'], "email")
				else:
					code = sendVerificationCodeBySms(date['phone'])
					payload = createValidationTokenPayload(code, date['phone'], "phone")
				serializer.save()
				return Response({
					'status': "SUCCESSFUL",
					'token': createToken(payload)
				})
			else:
				serializer.save()
				return Response({
					'status': "SUCCESSFUL"
				})
	except:
		return Response({"status":"FAILED"})
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class AdViewset(APIView):

	def get(self, request):
		ads = Ad.objects.all()
		serializer = AdGetSerializer(ads, many=True)
		return Response(serializer.data)

	def post(self, request):
		pprint(User.objects.filter(pseudo=request.data['user'])[0].id)
		request.data['user'] = User.objects.filter(pseudo=request.data['user'])[0].id
		serializer = AdPostSerializer(data=request.data)
		if serializer.is_valid():
			try:
				serializer.save()
			except Exception as e:
				return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
			return Response({'status': "SUCCESSFUL"})
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	
	def delete(self, request):
		try:
			ad = Ad.objects.get(id=int(request.data['id']))
			ad.delete()
			return Response({'status': "SUCCESSFUL"})
		except:
			return Response({'status': "FAILED"})


"""
class Adsviewset(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):

	queryset = Ad.objects.all()
	serializer_class = AdsSerializer
	filterset_fields = ['sens']
	search_fields = ['quantityType']

	def get(self, request):
		return self.list(request)

	def post(self, request, format=None):
		serializer = AdsSerializer(data=request.data)
		if serializer.is_valid():
			try:
				serializer.save()
			except:
				return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
"""