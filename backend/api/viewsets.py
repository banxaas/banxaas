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
		"login": "...", // Type String/Str
		"password": "..." // Type String/Str
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
		"token": "...", // Type String/Str
		"signature": "..." // Type String/Str
	}
	Ces informations sont fournis lors de la connexion
	"""
	try:
	# Boucle de vérification ( à voir si c'est performant ou pas)
		id_user = User.objects.get(pseudo=jwt.decode(request.data['token'], os.environ.get('JWT_SECRET'), algorithms="HS256")['sub']).id
		while True:
			# En attente de changement du token (c'est à dire, une nouvelle connexion)
			# Récupération de l'utilisateur
			user = User.objects.get(id=id_user)
			if not user.is_active:
				print("You need to validate the code")
				return Response({'status': True, 'motif': "Validate Code"})
			print('User is already active')
			if request.data['signature'] != Token.objects.filter(user=user)[0].key:
				print("You need to reconnect")
				return Response({'status': True, 'motif': "New Connexion"})
			time.sleep(10)	
	except:
		return Response({'status': 'FAILED', 'message':'Token Invalide'})

@api_view(['POST'])
def CreateAccountViewset(request):
	try:
		""" Cette fonction, permet de creer un compte utilisateur 
		Méthode autorisée: POST,
		JSON à soumettre: 
		{
		"pseudo": "...", // Type String/Str
		"password": "...", // Type String/Str
		"email":"..." // Type String/Str
		} ou
		{
		"pseudo": "...", // Type String/Str
		"password": "...", // Type String/Str
		"phone":"..." // Type String/Str
		}
		"""
		data = request.data
		keys = list(data.keys())
		# Vérification de la validité des données collectées
		if (len(keys) != 3) or ('pseudo' not in keys) or ('password' not in keys) or (('phone' not in keys) and ('email' not in keys)):
			return Response({'status': 'FAILED', 'message':'JSON invalide'})

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
			return Response({'status': 'FAILED', 'message': 'Types des données du JSON invalides!'})
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
	except:
		Response({'status': 'FAILED', 'message': "Vérifier votre connexion, Si l'erreur persiste, contactez moi!"})

@api_view(['POST'])
def ValidateCodeViewset(request):
	""" Cette fonction, permet de valider le code de l'utilisateur 
	Méthode autorisée: POST,
	JSON à soumettre: 
	{
	"code": ..., // Type Number/int
	"token": "..." // Type String/str
	}
	"""
	try:
		isValid, userId = verifyCodeValidation(request.data['code'], request.data['token'])
		if not isValid:
			return Response({'status': "FAILED", 'message': 'Token ou Code Invalide'})
		if User.objects.filter(email=userId):
			user = User.objects.filter(email=userId)[0]
		if User.objects.filter(phone=userId):
			user = User.objects.filter(phone=userId)[0]
		user.is_active = True
		user.save()
		return Response({'status': "SUCCESSFUL"})
	except:
		return Response({'status': "FAILED", 'message':'Token ou Code Invalide, Vérifier que vous avez récupéré le token de validation'})
	

class PaymentMethodViewset(APIView):

	def verifyExistingPm(self, name, phone):
		""" Permet de vérifier si le PM existe déja """
		if PaymentMethod.objects.filter(name=name, phone=phone):
			return True
		return False

	def post(self, request):
		""" Permet d'ajouter une méthode de paiement
		Méthode: POST,
		JSON: {
		'token': '...', // Type String/str 
		'signature': '...',  // Type string/str
		'name':'...', // Type String/str | Valeurs (WAVE, OM, FREE)
		'phone': ... // Type Number/Int
		}
		"""
		try:
			# Validité des éléments
			if len(request.data) != 4:
				return Response({'status': "FAILED", 'message':"JSON invalide"})
			token = request.data['token']

			# Vérifie si l'utilisateur est connecté
			if not isAuthenticated(token, request.data['signature']):
				return Response({"status": "FAILED", 'message': "Vous devez vous connecter"})
			
			# Verification existence PM
			if self.verifyExistingPm(request.data['name'], request.data['phone']):
				return Response({'status': "FAILED", "message": "Payment Method already exists!"})

			user = User.objects.get(pseudo=jwt.decode(token, os.environ.get('JWT_SECRET'), algorithms="HS256")['sub']).id # Récupération du User
			data = {'user':user, 'name':request.data['name'], 'phone':request.data['phone']}
			# Sérialisation
			serializer = PaymentMethodSerializer(data=data)
			if serializer.is_valid():
				serializer.save()
				data = serializer.data
				data['id'] = PaymentMethod.objects.get(name=data['name'], phone=data['phone']).id
				return Response({'status': "SUCCESSFUL", "paymentMethod": PaymentMethodForConnSerializer(data).data})
			return Response({'status': "FAILED", "message":"Types des données du JSON invalides!"})
		except:
			return Response({'status': "FAILED", "message":"Token ou Signature Invalide"})
		

	def delete(self, request):
		""" Permet de supprimer une méthode de paiement
		Méthode: POST,
		JSON: 
		{
		'token': '...', // Type String/str
		'signature': '...', // Type String/str
		'id':... // Type Number/int
		}
		"""
		try:
			# Validité des éléments
			if len(request.data) != 3:
				return Response({'status': "FAILED", "message":"JSON invalide"})
			token = request.data['token']
			# Vérifie si l'utilisateur est connecté
			if not isAuthenticated(token, request.data['signature']):
				return Response({"status": "FAILED", "message":"Vous devez vous connecter"})
			pm = PaymentMethod.objects.get(id=int(request.data['id']))
			pm.delete()
			return Response({'status': "SUCCESSFUL"})
		except Exception as e:
			return Response({'status': "FAILED", "message":"Token ou Signature Invalide"})

@api_view(['PATCH'])
def SetUserViewset(request):
	"""
	Permet de modifier les informations de l'utilisateurs
	Méthode: PATCH,
	JSON: {
		"token": "...", // Type String/str
		"signature":"...", // Type String/str
		"pseudo":"...", // Type String/str
		"email":"...", // Type String/str
		"password": "...", // Type String/str
		"newPassword": "...", // Type String/str
		"currency": "..." // Type String/str
	}
	"""
	try:
		data = request.data
		keys = list(data.keys())

		# Validité des éléments
		if len(data) > 7:
			return Response({'status': "FAILED", "message":"JSON invalide"})

		token = data['token'] # Récupération du Token

		# Vérifie si l'utilisateur est connecté
		if not isAuthenticated(token, data['signature']):
			return Response({"status": "FAILED", "message": "Vous devez vous connecter"})

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
			return Response({"status":"FAILED", "message":" Les deux champs password et newPassword sont obligatoires"})

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
		if not serializer.is_valid():
			#return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
			return Response({"status":"FAILED", "message": "Les Types des données du JSON sont invalides"})

		# Préparation des payload et envoie du code
		if (('email' in keys) and (user.email != data['email'])) or (('phone' in keys) and (user.phone != str(data['phone']))):
			if 'email' in keys:
				code = sendVerificationCodeByMail(data['email'])
				payload = createValidationTokenPayload(code, data['email'], "email")
			else:
				code = sendVerificationCodeBySms(date['phone'])
				payload = createValidationTokenPayload(code, date['phone'], "phone")
			serializer.save()
			user.is_active = False
			user.save()
			return Response({
				'status': "SUCCESSFUL",
				'token': createToken(payload)
			})
		if (('pseudo' in keys) and (user.pseudo != data['pseudo'])) or ('password' in keys):
			serializer.save()
			Token.objects.filter(user=user)[0].delete()
			Token.objects.create(user=user)
			return Response({
				'status': "SUCCESSFUL"
			})
		serializer.save()
		if ('currency' in keys):
			return Response({
				'status': "SUCCESSFUL",
				'currency': user.currency
			})
	except:
		return Response({"status":"FAILED", "message":"Token ou Signature Invalide ou Vous n'etes pas connecté à internet"})



class AdViewset(APIView):

	def post(self, request):
		"""
		Permet de modifier les informations de l'utilisateurs
		Méthode: PATCH,
		JSON: {
			// Obligatoire
			"token": "...", // Type String/str 
			"signature":"...", // Type String/str
			"sens":"...", // Type String/str | values(A ou V)
			"quantityType":"...", // Type String/str | values(F ou R)
			"amountType": "...", // Type String/str | values(F ou R)
			"marge": "...", //Number, Int
			"provider": "..."
			// Optionnel selon le Type
			'quantityFixe': '...', // Type String/str
			'quantityMin': '...', // Type String/str
			'quantityMax': '...', // Type String/str
			'amountFixe': '...', // Type String/str
			'amountMin': '...', // Type String/str
			'amountMax': '...' // Type String/str
		}
		"""
		try:
			data = request.data
			token = data['token'] # Récupération du Token
			
			# Vérifie si l'utilisateur est connecté
			if not isAuthenticated(token, data['signature']):
				return Response({"status": "FAILED", "message": "Vous devez vous connecter"})
			
			# Nettoyage de data
			data.pop('token')
			data.pop('signature')

			keys = list(data.keys())
			fields = ['sens', 'quantityType', 'quantityFixe', 'quantityMin', 'quantityMax', 'amountType', 'amountFixe', 'amountMin', 'amountMax', 'marge', 'provider']
			
			# Donnée en plus
			for key in keys:
				if key not in fields:
					return Response({"status": "FAILED", "message":"JSON invalide"})

			# Vérification de la conformité des données
			if data['quantityType'] != data['amountType']:
				return Response({"status": "FAILED", "message":"quantityType et amountType ne peuvent pas être différents"})
			if (data['quantityType'] == 'F') and (('quantityFixe' not in keys) or ('amountFixe' not in keys)):
				return Response({"status": "FAILED", "message":"Quand le type est fixe, les champs quantityFixe et amountFixe deviennent Obligatoires"})
			if (data['quantityType'] == 'F') and (('quantityMin' in keys) or ('quantityMax' in keys) or ('amountMin' in keys) or ('amountMax' in keys)):
				return Response({"status": "FAILED", "message":"Quand le type est fixe, les champs (quantityMin, quantityMax, amountMin, amountMax) ne doivent pas figurer dans le JSON"})
			if (data['quantityType'] == 'R') and (('quantityMin' not in keys) or ('quantityMax' not in keys) or ('amountMin' not in keys) or ('amountMax' not in keys)):
				return Response({"status": 'FAILED', "message":"Quand le type est range, les champs (quantityMin, quantityMax, amountMin, amountMax) deviennent Obligatoires"})
			if (data['quantityType'] == 'R') and (('quantityFixe' in keys) or ('quantityFixe' in keys)):
				return Response({"status": 'FAILED', "message":"Quand le type est range, les champs quantityFixe et amountFixe ne doivent pas figurer dans le JSON"})
			if (data['quantityType'] == 'R') and ((data['quantityMin'] >= data['quantityMax']) or (data['amountMin'] >= data['amountMax'])):
				return Response({"status": 'FAILED', "message":"Les valeurs quantityMin et amountMin ne peuvent pas être supérieur à quantityMax et amountMax"})

			# Récupération de user
			user = User.objects.get(pseudo=jwt.decode(token, os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
			data['user'] = user.id # ajout de user dans data
			pprint(data)
			serializer = AdSerializer(data=data)
			if serializer.is_valid():
				serializer.save()
				return Response({'status': "SUCCESSFUL"})	
			return Response({'status': "FAILED", "message":"Types des données du JSON invalides!"})
		except:
			return Response({"status": "FAILED", "message": "Token ou Signature Invalide"})
		
	
	def delete(self, request):
		"""
		Permet de supprimer une annonce
		Méthode: DELETE,
		JSON: {
			'token': '...', 
			'signature':'...', 
			'id':... // (Il s'agit de l'id de l'annonce) Type Number/int
		}
		"""
		try:
			data = request.data
			if len(data) != 3:
				return Response({"status": "FAILED", "message": "JSON invalide"})

			token = data['token'] # Récupération du Token
			# Vérifie si l'utilisateur est connecté
			if not isAuthenticated(token, data['signature']):
				return Response({"status": "FAILED", "message":"Vous devez vous connecter"})
			
			# Nettoyage de data
			data.pop('token')
			data.pop('signature')
			user = User.objects.get(pseudo=jwt.decode(token, os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
			ad = Ad.objects.get(id=int(request.data['id']), user=user.id)
			ad.delete()
			return Response({'status': "SUCCESSFUL"})
		except:
			return Response({'status': "FAILED", "message":"Token ou Signature invalide"})


class AdsViewset(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):

	queryset = Ad.objects.all()
	serializer_class = AdsSerializer

	def post(self, request, page):
		try:
			if page < 1:
				return Response({"status":"FAILED", "message":"L'iindice de page minimal est 1"})
			token = request.data['token'] # Récupération du Token
			# Vérifie si l'utilisateur est connecté
			if not isAuthenticated(token, request.data['signature']):
				return Response({"status": "FAILED", "message":"Vous devez vous connecter"})
			self.queryset = Ad.objects.order_by('-publicationDate')[ (page-1)*10:10*page]
			return self.list(request)
		except:
			return Response({"status": "FAILED", "message":"Token ou Signature Invalide"})
