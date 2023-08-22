import re
import time
import math
import json
from pprint import pprint
from .permissions import IsAuthenticatedPermission, CheckApiKeyAuth
from rest_framework import generics, mixins
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from api.repository.authRepository import *
from api.repository.tradeRepository import *
from .serializers import *
from django.utils import timezone
from operator import attrgetter


class ConnexionViewset(APIView):
    permission_classes = [CheckApiKeyAuth,]

    def post(self, request):
        """ Cette fonction prend en charge de la connexion des utilisateurs.
        Methode autorisée: POST,
        JSON à soumettre: {
            "login": "...", // Type String/Str
            "password": "..." // Type String/Str
        }        """
        # Vérification de la validité des données collectées
        try:
            [login, password] = isRequestDataConnexionValid(request.data)
        except TypeError:
            return Response({'status': "FAILED", 'message': "Identifiants Incorrects"},status=status.HTTP_400_BAD_REQUEST)

        # Vérification de l'existence du user (pseudo, email, telephone)
        user = getUserByLogin(login)
        if (not user) or (not user.check_password(password)):
            return Response({'status': "FAILED", 'message': "Identifiants Incorrects"},status=status.HTTP_400_BAD_REQUEST)

        # Vérification de l'état du compte de l'utilisateur
        if not user.is_active:
            deltaTime = datetime.now(timezone.utc) - user.date_joined
            pprint(deltaTime.total_seconds())
            # Verifier si le code de validation a expiré
            if deltaTime.total_seconds() > 300:
                # Supprimer le token
                if Token.objects.filter(user=user):
                    Token.objects.filter(user=user)[0].delete()
                # Supprimer l'utilisateur
                user.delete()
                return Response({'status': "INACTIVATED", 
                             'message': "Compte supprimé car il n'a pas été activé avant l'expiration du code."
                             }, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({'status': "INACTIVATED", 
                             'message': "Veillez activer votre compte avant l'expiration du code."
                             }, status=status.HTTP_400_BAD_REQUEST)


        # Déconnexion de l'utilisateur s'il est connecté autre part
        if user.isAuthenticated:
            user.disconnect()

        if Token.objects.filter(user=user):
            Token.objects.filter(user=user)[0].delete()

        # Création du token JWT
        iat = datetime.now(timezone.utc)
        exp = iat + timedelta(seconds=72000)
        payload = {'sub': user.pseudo, 'iat': iat, 'exp': exp}
        jwt = createToken(payload)  # Créer un nouvel Token JWT

        # Création du Token Signature de Connexion
        # Permet d'identifier la connexion de l'utilisateur
        signature = Token.objects.create(user=user)
        user.connect()
        user.save()

        # Sérialisation
        serializer = UserDetailSerializer(user)

        return Response({
            'status': "SUCCESSFUL",
            'user': serializer.data,
            'numberOfAds': Ad.get_num_of_ads_available(),
            'token': jwt,
            'signature': signature.key
        },status=status.HTTP_200_OK)


class ConnexionRoomName(APIView):
    permission_classes = [IsAuthenticatedPermission, CheckApiKeyAuth]
    def get(self, request):
        """ Cette fonction permet de récupérer le chat room de l'utilisateur
            Méthode Autorisée: GET,
        """
        try:
          
            id_user = User.objects.get(pseudo=jwt.decode(
                request.headers.get('Authorization').split()[1], os.environ.get('JWT_SECRET'), algorithms="HS256")['sub']).id

            roomName = hashlib.sha256(str(id_user).encode('utf-8')).hexdigest()
            return Response({"status": "SUCCESFUL", "room_name": roomName},status=status.HTTP_200_OK)
        except:
            return Response({"status": "FAILED", 'message': "Erreur non identifié"},status=status.HTTP_400_BAD_REQUEST)


class   Disconnect(APIView):
    permission_classes = [IsAuthenticatedPermission, CheckApiKeyAuth]
    def post(self, request):
        """ Cette fonction permet de déconecter l'utilisateur
            Méthode Autorisée: POST,
        """
        try:
            user = User.objects.get(pseudo=jwt.decode(
                request.headers.get('Authorization').split()[1], os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
            user.disconnect()
            Token.objects.filter(user=user)[0].delete()
            return Response({"status": "SUCCESSFUL", 'message': "Déconnecté avec succès !"},status=status.HTTP_200_OK)
        except:
            return Response({"status": "FAILED", 'message': "Erreur non identifié !"},status=status.HTTP_400_BAD_REQUEST)


class CreateAccountViewset(APIView):
    permission_classes = [CheckApiKeyAuth,]

    def post(self, request):
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
        try:
            data = request.data.copy()
            keys = list(data.keys())
            # Vérification de la validité des données collectées
            if (len(keys) != 3) or ('pseudo' not in keys) or ('password' not in keys) or (
                    ('phone' not in keys) and ('email' not in keys)):
                return Response({'status': 'FAILED', 'message': 'JSON invalide'},status=status.HTTP_400_BAD_REQUEST)

            if 'email' in keys:
                # L'utilisateur a donné son email
                email = data['email']
                emailRegex = "([A-Za-z0-9]+[._-]?)*[A-Za-z0-9]+@([A-Za-z0-9]+[._-]?)*[A-Za-z0-9]+\\.([A-Z|a-z]{2,})"
                if (not re.match(emailRegex, email)):  # Regex Email Vérification
                    return Response({'status': 'Email Invalide'},status=status.HTTP_400_BAD_REQUEST)
                # Vérification d'un potentiel utilisateur avec cet email
                userExist, response = verifyUser(email)
            else:
                # L'utilisateur a donné son phone
                phone = data['phone']
                # Regex Phone Verification
                phoneRegex = "^(77|78|75|70|76)[0-9]{7}$"
                if (not re.match(phoneRegex, phone)):
                    return Response({'status': 'Phone Invalide'},status=status.HTTP_400_BAD_REQUEST)
                # Vérification d'un potentiel utilisateur avec ce mail
                userExist, response = verifyUser(data['phone'])
            if userExist:
                return response
            serializer = CreateAccountSerializer(data=data)  # Sérialisation
            if not serializer.is_valid():
                return Response({'status': 'FAILED', 'message': 'Types des données du JSON invalides!'},status=status.HTTP_400_BAD_REQUEST)
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
            },status=status.HTTP_201_CREATED)
        except:
            return Response(
                {'status': 'FAILED', 'message': "Vérifier votre connexion, Si l'erreur persiste, contactez moi!"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SendValidationCode(APIView):
    permission_classes = [CheckApiKeyAuth]
    
    def post(self, request):
        """ Cette fonction, permet de renvoyer un nouveau code de validation
        Méthode autorisée: POST,
        JSON à soumettre:
        {
        "email": ..., // Type String
        ou 
        "phone": ..., // Type String
        }
        """
        try:
            data = request.data.copy()
            keys = list(data.keys())
            if(len(keys) > 1) or (('phone' not in keys) and ('email' not in keys)):
                        return Response({'status': 'FAILED', 'message': 'JSON invalide'},status=status.HTTP_400_BAD_REQUEST)
            if 'email' in keys:
                email = data['email']
                code = sendVerificationCodeByMail(email)
                payload = createValidationTokenPayload(code, email, "email")
            else:
                phone = data['phone']
                code = sendVerificationCodeBySms(phone)
                payload = createValidationTokenPayload(code, phone, "phone")
            return Response({
                'status': "SUCCESSFUL",
                'token': createToken(payload)
            },status=status.HTTP_201_CREATED)
        except:
            return Response(
                {'status': 'FAILED', 'message': "Vérifier votre connexion, Si l'erreur persiste, contactez moi!"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ValidateCodeViewset(APIView):
    permission_classes = [CheckApiKeyAuth]

    def post(self, request):
        """ Cette fonction, permet de valider le code de l'utilisateur
        Méthode autorisée: POST,
        JSON à soumettre:
        {
        "code": ..., // Type Number/int
        "token": "..." // Type String/str
        }
        """
        try:
            isValid, userId = verifyCodeValidation(
                request.data['code'],request.data['token'])
            if not isValid:
                return Response({'status': "FAILED", 'message': 'Token ou Code Invalide'},status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(email=userId):
                user = User.objects.filter(email=userId).first()
            if User.objects.filter(phone=userId):
                user = User.objects.filter(phone=userId).first()
            user.is_active = True
            user.save()
            return Response({'status': "SUCCESSFUL"},status=status.HTTP_200_OK)
        except:
            return Response({'status': "FAILED",
                            'message': 'Token ou Code Invalide, Vérifier que vous avez récupéré le token de validation'},status=status.HTTP_400_BAD_REQUEST)


class PaymentMethodViewset(APIView):
    permission_classes = [IsAuthenticatedPermission, CheckApiKeyAuth]
    def verifyExistingPm(self, name, phone):
        """ Permet de vérifier si le PM existe déja """
        if PaymentMethod.objects.filter(name=name, phone=phone):
            return True
        return False
    
    def verifyExistingPmOnUser(self, user, phone):
        """ Permet de vérifier si le PM existe déja avec un autre utilisateur """
        paymentMethod = PaymentMethod.objects.filter(~Q(user=user), phone=phone)
        if paymentMethod.count() > 0:
            return True
        return False

    def post(self, request):
        """ Permet d'ajouter une méthode de paiement
        Méthode: POST,
        JSON: {
        'name':'...', // Type String/str | Valeurs (WAVE, OM, FREE)
        'phone': ... // Type Number/Int
        }
        """
        try:
            # Validité des éléments
            if len(request.data) != 2:
                return Response({'status': "FAILED", 'message': "JSON invalide"},status=status.HTTP_400_BAD_REQUEST)
            token = request.headers.get('Authorization').split()[1]

            # Vérifie si l'utilisateur est connecté
          
            
            
            user = User.objects.get(pseudo=jwt.decode(token, os.environ.get('JWT_SECRET'), algorithms="HS256")[
                'sub']).id 
            if self.verifyExistingPmOnUser(user, request.data['phone']):
                return Response({'status': "FAILED", "message": "This number already added by another user!"},status=status.HTTP_400_BAD_REQUEST)
            
            # Verification existence PM
            if self.verifyExistingPm(request.data['name'], request.data['phone']):
                return Response({'status': "FAILED", "message": "Payment Method already exists!"},status=status.HTTP_400_BAD_REQUEST)

             # Récupération du User
            data = {
                'user': user, 'name': request.data['name'], 'phone': request.data['phone']}
            # Sérialisation
            serializer = PaymentMethodSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                data = serializer.data
                data['id'] = PaymentMethod.objects.get(
                    name=data['name'], phone=data['phone']).id
                return Response({'status': "SUCCESSFUL", "paymentMethod": PaymentMethodForConnSerializer(data).data},status=status.HTTP_200_OK)
            return Response({'status': "FAILED", "message": "Types des données du JSON invalides!"},status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'status': "FAILED", "message": "Token ou Signature Invalide"},status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """ Permet de supprimer une méthode de paiement
        Méthode: POST,
        JSON:
        {
        'id':... // Type Number/int
        }
        """
        try:
            # Validité des éléments
            if len(request.data) != 1:
                return Response({'status': "FAILED", "message": "JSON invalide"})
            # Vérifie si l'utilisateur est connecté
            pm = PaymentMethod.objects.get(id=int(request.data['id']))
            pm.delete()
            return Response({'status': "SUCCESSFUL"},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'status': "FAILED", "message": "Token ou Signature Invalide"},status=status.HTTP_401_UNAUTHORIZED)


class UserViewset(APIView):
    permission_classes = [CheckApiKeyAuth]

    def patch(self, request):
        """
        Permet de modifier les informations de l'utilisateurs
        Méthode: PATCH,
        JSON: {
            "pseudo":"...", // Type String/str
            "email":"...", // Type String/str
            "password": "...", // Type String/str
            "newPassword": "...", // Type String/str
            "currency": "..." // Type String/str
        }
        """
        try:
            data = request.data.copy()
            keys = list(data.keys())

            # Validité des éléments
            if len(data) > 5:
                return Response({'status': "FAILED", "message": "JSON invalide"},status=status.HTTP_400_BAD_REQUEST)

            token = request.headers.get('Authorization').split()[1]  # Récupération du Token

            # Vérifie si l'utilisateur est connecté
           

            user = User.objects.get(pseudo=jwt.decode(
                token, os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])

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
                # Regex Email Vérification
                if not re.match(emailRegex, data['email']):
                    return Response({'status': 'Email Invalide'},status=status.HTTP_400_BAD_REQUEST)

            if ('phone' in keys) and (user.phone != str(data['phone'])):
                phoneExist, response = verifyUser(data['phone'])
                if phoneExist:
                    return response
                phoneRegex = "^(77|78|75|70|76)[0-9]{7}$"
                if not re.match(phoneRegex, str(data['phone'])):
                    return Response({'status': 'Phone Invalide'},status=status.HTTP_400_BAD_REQUEST)

            if (('password' in keys) and ('newPassword' not in keys)) or (
                    ('newPassword' in keys) and ('password' not in keys)):
                return Response(
                    {"status": "FAILED", "message": " Les deux champs password et newPassword sont obligatoires"},status=status.HTTP_400_BAD_REQUEST)

            if ('password' in keys) and ('newPassword' in keys):
                if user.check_password(data['password']):
                    data['password'] = make_password(data['newPassword'])
                    data.pop('newPassword')
                else:
                    return Response({'status': "FAILED", 'message': "Mot de passe incorrect !"},status=status.HTTP_400_BAD_REQUEST)

            # Nettoyage de data
            
            # sérialisation
            serializer = SetAccountSerializer(user, data=data, partial=True)
            if not serializer.is_valid():
                # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                return Response({"status": "FAILED", "message": "Les Types des données du JSON sont invalides"},status=status.HTTP_400_BAD_REQUEST)

            # Préparation des payload et envoie du code
            if (('email' in keys) and (user.email != data['email'])) or (
                    ('phone' in keys) and (user.phone != str(data['phone']))):
                if 'email' in keys:
                    code = sendVerificationCodeByMail(data['email'])
                    payload = createValidationTokenPayload(
                        code, data['email'], "email")
                else:
                    code = sendVerificationCodeBySms(data['phone'])
                    payload = createValidationTokenPayload(
                        code, data['phone'], "phone")
                serializer.save()
                user.is_active = False
                user.save()
                return Response({
                    'status': "SUCCESSFUL",
                    'motif': 'Validate Code',
                    'token': createToken(payload)
                },status=status.HTTP_201_CREATED)
            if (('pseudo' in keys) and (user.pseudo != data['pseudo'])) or ('password' in keys):
                serializer.save()
                Token.objects.filter(user=user)[0].delete()
                Token.objects.create(user=user)
                return Response({
                    'status': "SUCCESSFUL",
                    'motif': 'Reconnexion'
                },status=status.HTTP_200_OK)
            serializer.save()
            if ('currency' in keys):
                return Response({
                    'status': "SUCCESSFUL",
                    'currency': user.currency,
                    'motif': 'Pas de reconnexion'
                },status=status.HTTP_200_OK)
        except:
            return Response(
                {"status": "FAILED", "message": "Token ou Signature Invalide ou Vous n'etes pas connecté à internet"},status=status.HTTP_400_BAD_REQUEST)


class AdViewset(APIView):
    permission_classes = [IsAuthenticatedPermission, CheckApiKeyAuth]
    def post(self, request):
        """
        Permet de modifier les informations de l'utilisateurs
        Méthode: PATCH,
        JSON: {
            // Obligatoire
            "sens":"...", // Type String/str | values(A ou V)
            "quantityType":"...", // Type String/str | values(F ou R)
            "amountType": "...", // Type String/str | values(F ou R)
            "marge": "...", //Number, Int
            "provider": "...",
            "phone": "...", //Number,Int
            // Optionnel selon le Type
            "quantityFixe": "...", // Type String/str
            "quantityMin": "...", // Type String/str
            "quantityMax": "...", // Type String/str
            "amountFixe": "...", // Type String/str
            "amountMin": "...", // Type String/str
            "amountMax": "..." // Type String/str
        }
        """
        try:
            data = request.data.copy()
            token = request.headers.get('Authorization').split()[1]  # Récupération du Token

            # Vérifie si l'utilisateur est connecté
          

            # Nettoyage de data
      
            keys = list(data.keys())
            fields = ['sens', 'quantityType', 'quantityFixe', 'quantityMin', 'quantityMax', 'amountType', 'amountFixe',
                      'amountMin', 'amountMax', 'marge', 'provider', 'phone']

            # Donnée en plus
            for key in keys:
                if key not in fields:
                    return Response({"status": "FAILED", "message": "JSON invalide"},status=status.HTTP_400_BAD_REQUEST)

            # Vérification de la conformité des données
            if data['quantityType'] != data['amountType']:
                return Response(
                    {"status": "FAILED", "message": "quantityType et amountType ne peuvent pas être différents"})
            if (data['quantityType'] == 'F') and (('quantityFixe' not in keys) or ('amountFixe' not in keys)):
                return Response({"status": "FAILED",
                                 "message": "Quand le type est fixe, les champs quantityFixe et amountFixe deviennent Obligatoires"},status=status.HTTP_400_BAD_REQUEST)
            if (data['quantityType'] == 'F') and (
                    ('quantityMin' in keys) or ('quantityMax' in keys) or ('amountMin' in keys) or (
                    'amountMax' in keys)):
                return Response({"status": "FAILED",
                                 "message": "Quand le type est fixe, les champs (quantityMin, quantityMax, amountMin, amountMax) ne doivent pas figurer dans le JSON"},status=status.HTTP_400_BAD_REQUEST)
            if (data['quantityType'] == 'R') and (
                    ('quantityMin' not in keys) or ('quantityMax' not in keys) or ('amountMin' not in keys) or (
                    'amountMax' not in keys)):
                return Response({"status": 'FAILED',
                                 "message": "Quand le type est range, les champs (quantityMin, quantityMax, amountMin, amountMax) deviennent Obligatoires"},status=status.HTTP_400_BAD_REQUEST)
            if (data['quantityType'] == 'R') and (('quantityFixe' in keys) or ('quantityFixe' in keys)):
                return Response({"status": 'FAILED',
                                 "message": "Quand le type est range, les champs quantityFixe et amountFixe ne doivent pas figurer dans le JSON"},status=status.HTTP_400_BAD_REQUEST)
            if (data['quantityType'] == 'R') and (
                    (float(data['quantityMin']) >= float(data['quantityMax'])) or (float(data['amountMin']) >= float(data['amountMax']))):
                return Response({"status": 'FAILED',
                                 "message": "Les valeurs quantityMin et amountMin ne peuvent pas être supérieur à quantityMax et amountMax"},status=status.HTTP_400_BAD_REQUEST)

            # Récupération de user
            user = User.objects.get(pseudo=jwt.decode(
                token, os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
            
            # Vérification du méthode de paiement associé
            pprint(user)
            pprint(data['provider'])
            pprint(data['phone'])
            pm = list(PaymentMethod.objects.filter(user=user, name=data['provider'], phone=data['phone']))
            pprint(pm)
            if not pm:
                return Response({'status': "FAILED", "message":"Ce méthode de paiment n'existe pas !"},status=status.HTTP_404_NOT_FOUND)
            
            data['user'] = user.id  # ajout de user dans data
            serializer = AdSerializer(data=data)

            # Vérification du méthode de paiement associé
            if serializer.is_valid():
                serializer.save()
                return Response({'status': "SUCCESSFUL"},status=status.HTTP_200_OK)
            return Response({'status': "FAILED", "message": "Types des données du JSON invalides!"},status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"status": "FAILED", "message": "Token ou  Invalide"},status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request):
        """
        Permet de supprimer une annonce
        Méthode: DELETE,
        JSON: {
            'id':... // (Il s'agit de l'id de l'annonce) Type Number/int
        }
        """
        try:
            data = request.data.copy()
            if len(data) != 1:
                return Response({"status": "FAILED", "message": "JSON invalide"})

            token = request.headers.get('Authorization').split()[1]  # Récupération du Token
            # Vérifie si l'utilisateur est connecté
          

            # Nettoyage de data
            user = User.objects.get(pseudo=jwt.decode(
                token, os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
            ad = Ad.objects.get(id=int(request.data['id']), user=user.id)
            ad.delete()
            return Response({'status': "SUCCESSFUL"},status=status.HTTP_200_OK)
        except:
            return Response({'status': "FAILED", "message": "Token ou Signature invalide"},status=status.HTTP_401_UNAUTHORIZED)


class AdsViewset(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = Ad.objects.filter(status="I")
    serializer_class = AdsSerializer
    permission_classes = [IsAuthenticatedPermission, CheckApiKeyAuth]
    def get(self, request, page):
        # try:
        if page < 1:
            return Response({"status": "FAILED", "message": "L'iindice de page minimal est 1"},status=status.HTTP_400_BAD_REQUEST)
        # Vérifie si l'utilisateur est connecté
        self.queryset = Ad.objects.order_by(
            '-publicationDate')[(page - 1) * 10:10 * page]
        return self.list(request)
    # except:
        return Response({"status": "FAILED", "message": "Token ou Signature Invalide"})


class InitTradeViewset(APIView):
    permission_classes = [IsAuthenticatedPermission, CheckApiKeyAuth]
    def post(self, request):
        """
        Permet d'initialiser un trade
        Méthode: POST,
        JSON: {
            "adId": ... // Type Interger/Int
        }
        """
 
        #try:
        # Vérifie si l'utilisateur est connecté
        if not isAuthenticated(request.headers.get('Authorization').split()[1], request.headers.get('Signature')):
            return Response({"status": "FAILED", "message": "Vous devez vous connecter"},status=status.HTTP_401_UNAUTHORIZED)

        # Vérifie si l'utilisateur ne trade pas son propre offre
        trader = User.objects.get(pseudo=jwt.decode(
            request.headers.get('Authorization').split()[1], os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
        ad = Ad.objects.get(id=request.data['adId'])

        if ad.user == trader:
            return Response({"status": "FAILED", "message": "Il s'agit de votre propre offre !"},status=status.HTTP_400_BAD_REQUEST)

        # Mise à jour de l'état de l'annonce
        ad = Ad.objects.get(id=request.data['adId'])
        if ad.status != "I":
            return Response({"status": "FAILED", "message": "Désolé cet annonce n'est plus disponible !"},status=status.HTTP_404_NOT_FOUND)
        ad.status = "C"
        ad.save()

        # Récupération des élements du trade
        walletAddress = bdk_generate_address()
        pprint('The wallet address is: ' + walletAddress)
        pprint('Amount in banxaas wallet: ' + str(bdk_get_balance()))

        # Initialisation du trade
        trade = Trade.objects.create(
            trader=trader, ad=ad, walletAddress=walletAddress)

        # Mise à jour du tradeHash
        startingDate = math.log2(int(str(trade.startingDate.day) + str(trade.startingDate.month) + str(trade.startingDate.year) + str(
            trade.startingDate.hour) + str(trade.startingDate.minute) + str(trade.startingDate.second) + str(trade.startingDate.microsecond))-1)
        traderHash = hashlib.sha256(
            str(trader.id).encode('utf-8')).hexdigest()
        adHash = hashlib.sha256(str(ad.id).encode('utf-8')).hexdigest()
        walletAddressHash = hashlib.sha256(
            str(walletAddress).encode('utf-8')).hexdigest()
        startingDateHash = hashlib.sha256(
            str(startingDate).encode('utf-8')).hexdigest()
        tradeHash = hashlib.sha256(str(
            traderHash + adHash + walletAddressHash + startingDateHash).encode('utf-8')).hexdigest()
        trade.tradeHash = tradeHash
        trade.save()

        # Envoie de la notification
        if ad.user.email:
            sellerMail = ad.user.email
            sellerPseudo = ad.user.pseudo
            sendNotificationByMailToSeller(sellerMail, sellerPseudo)
        else:
            sellerPhone = ad.user.phone
            sellerPseudo = ad.user.pseudo
            sendNotificationByPhoneToSeller(sellerPhone, sellerPseudo)
        
        serializer = TradeSerializer(trade)

        # Reponse
        return Response({'status': 'SUCCESSFUL', 'tradeHash': tradeHash, 'currentTrade': serializer.data, "step": 1},status=status.HTTP_201_CREATED)

        # except:
        #     return Response({'status': 'FAILED', 'message': 'JSON invalide, si le problème persiste contacte moi !'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TradeViewset(APIView):
    # permission_classes = [IsAuthenticatedPermission, CheckApiKeyAuth]
    permission_classes = []
    
    def verification(self, token, signature, tradeId, tradeHash):
        try:
            # Vérification du trade et de la signature
            
            # Récupération de l'utilisateur qui a envoyé la requête
            user = User.objects.get(pseudo=jwt.decode(
                token, os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
            
            # Récupération du trade associé
            trade = Trade.objects.get(tradeHash=tradeHash, id=tradeId)
            print("trade.ad ", trade.ad.sens)
            print("trade.ad.user ", trade.ad.user)
            print("trade.trader ", trade.trader)
            # Identification du sens du trade et du role de l'utilisateur
            sens = trade.ad.sens
            if sens == 'V' and user == trade.ad.user:
                role = 'Vendeur'
            elif sens == 'V' and user == trade.trader:
                role = 'Acheteur'
            elif sens == 'A' and user == trade.ad.user:
                role = 'Acheteur'
            elif sens == 'A' and user == trade.trader:
                role = 'Vendeur'
            else:
                return Response({'status':'FAILED', 'message': 'Vous n etes pas un acteur !'},status=status.HTTP_401_UNAUTHORIZED)
            return Response({'status':'SUCCESSFUL', 'role': role, 'trade':trade},status=status.HTTP_200_OK)
        except:
            return Response({'status':'FAILED', 'message':'Transaction inexistante Verif'},status=status.HTTP_404_NOT_FOUND)


    def get(self, request, tradeHash):
        try:
            trade = Trade.objects.get(tradeHash=tradeHash)
            return Response({'status': "SUCCESSFUL"},status=status.HTTP_200_OK)
        except:
            return Response({'status': 'FAILED', 'message': 'Transaction inexistante'},status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request, tradeHash):
        try:
        # Vérification du trade et de la signature
            verification = self.verification(request.headers.get('Authorization').split()[1], request.headers.get('Signature'), request.data['tradeId' ], tradeHash)
            print("verification post", verification.data)
            if verification.data:
                verification = verification.data
            if verification['status'] == "FAILED":
                return Response(verification)
            serializer = TradeSerializer(verification['trade'])
            return Response({'status': "SUCCESSFUL", 'trade': serializer.data, 'role':verification['role']},status=status.HTTP_200_OK)
        except:
            return Response({'status': 'FAILED', 'message': 'Transaction inexistante'},status=status.HTTP_404_NOT_FOUND)


    def patch(self, request, tradeHash):
        try:
            print("patch ")
            verification = self.verification(request.headers.get('Authorization').split()[0], request.headers.get('Signature'), request.data['tradeId'], tradeHash)
            if verification.data:
                verification = verification.data
            if verification['status'] == "FAILED":
                return Response(verification)

            if request.data['role'] != verification['role']:
                return Response({'status':'FAILED', 'message': 'Les roles ne correspondent pas!'},status=status.HTTP_401_UNAUTHORIZED)
            
            role = verification['role']
            trade = verification['trade']
            # Vérification de la légitimité de l'envoie et traitement associé
            
            step = int(request.data['step'])
             
            if(int(trade.steps) > step):
                return Response({'status':'FAILED', 'message':"Cette étape est inférieure à l'étape actuel!"},status=status.HTTP_400_BAD_REQUEST)
            

            if role == "Vendeur" and step == 2:
                trade.txId = request.data['txId']
                montant = float(trade.ad.quantityFixe) * 100000000
                pprint("Le montant de la transaction est de: " + str(montant))
                montant_to_check = montant + (montant * 0.02)
                pprint("Le montant à vérifier est de: " + str(montant_to_check))
                verify = mempool_check_transaction(trade.txId, trade.walletAddress, montant_to_check)
                print("XXXXXXXXX ", verify)       
                if not verify[0]:
                    return Response({'status':'FAILED', 'message': verify[1]},status=status.HTTP_400_BAD_REQUEST)
            elif role == "Acheteur" and step == 3:
                trade.transactionId = request.data['transactionId']
            elif role == "Vendeur" and step == 4:
                pprint("Légitime")
            elif role == "Acheteur" and step == 5:
                trade.buyerWalletAdress = request.data['buyerWalletAdress']
                montant = float(trade.ad.quantityFixe) * 100000000
                pprint("Le montant de la transaction est de: " + str(montant))
                montant_to_send = montant - (montant * 0.03)
                pprint("Le montant à envoyer est de: " + str(montant_to_send))
                print(bdk_do_transaction(trade.buyerWalletAdress, montant_to_send))
                trade.ad.status = 'F'
                trade.status = 'F'
            else:
                return Response({'status':'FAILED', 'message': 'Cette action ne vous correspond pas!'},status=status.HTTP_400_BAD_REQUEST)
            
            trade.steps = step
             # Mise à jour du stepHash
            startingDate = math.log2(int(str(trade.startingDate.day) + str(trade.startingDate.month) + str(trade.startingDate.year) + str(
                trade.startingDate.hour) + str(trade.startingDate.minute) + str(trade.startingDate.second) + str(trade.startingDate.microsecond))-1)
            traderHash = hashlib.sha256(
                str(trade.id).encode('utf-8')).hexdigest()
            stepHash = hashlib.sha256(str(step).encode('utf-8')).hexdigest()
            startingDateHash = hashlib.sha256(
                str(startingDate).encode('utf-8')).hexdigest()
            stepHash = hashlib.sha256(str(
                traderHash + stepHash  + startingDateHash).encode('utf-8')).hexdigest()
            trade.stepHash = stepHash

            trade.save()
            return Response({'status': 'SUCCESSFUL', 'message': 'Trade mis à jour avec succès !', 'role':role},status=status.HTTP_200_OK)
        except:
           return Response({'status': 'FAILED', 'message': 'Pas encore identifié'})


class DeleteInactiveAccounts(APIView):
    def get(self, request):
        try:
            cutoff_time = timezone.now() - timedelta(minutes=5)
            users_to_delete = User.objects.filter(date_joined__lt=cutoff_time, is_active=False)
            users_to_delete.delete()
            return Response({'status': 'SUCCESSFUL', 'message': 'Les comptes non activés ont été supprimés avec succès'}, status=status.HTTP_200_OK)
        except TypeError:
            return Response({'status': 'FAILED'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TransactionsViewset(APIView):
    """
    Permet de lister les transactions d'un utilisateur
    Méthode: GET,
    """
    permission_classes = [IsAuthenticatedPermission, CheckApiKeyAuth]

    def get(self, request, page):
        # Vérifie si l'utilisateur est connecté
        if not isAuthenticated(request.headers.get('Authorization').split()[1], request.headers.get('Signature')):
            return Response({"status": "FAILED", "message": "Vous devez vous connecter"},status=status.HTTP_401_UNAUTHORIZED)
        #Recuperer l'utilisateur
        user = User.objects.get(pseudo=jwt.decode(
            request.headers.get('Authorization').split()[1], os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
        trades = Trade.objects.filter(trader=user, status="F")
        ads = Trade.objects.filter(ad__user=user, status="F")
        transactions = sorted(list(trades) + list(ads), key=attrgetter('startingDate'))[(page - 1) * 10:10 * page]
        serializer = TransactionSerializer(transactions, many=True)
        return Response({'status': 'SUCCESSFUL', 'transactions': serializer.data}, status=status.HTTP_200_OK)
    

class TransactionViewset(APIView):
    """
    Permet de recuperer une transaction en particulier à l'aide de son tradeHash
    """
    permission_classes = [IsAuthenticatedPermission, CheckApiKeyAuth]
    def get(self, request, tradeHash=None):
        try:
            # Vérifie si l'utilisateur est connecté
            if not isAuthenticated(request.headers.get('Authorization').split()[1], request.headers.get('Signature')):
                return Response({"status": "FAILED", "message": "Vous devez vous connecter"},status=status.HTTP_401_UNAUTHORIZED)
            user = User.objects.get(pseudo=jwt.decode(
                request.headers.get('Authorization').split()[1], os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
            trade = Trade.objects.get(tradeHash=tradeHash)
            if trade.trader == user or trade.ad.user == user:
                serializer = TransactionSerializer(trade)
                return Response({'status': 'SUCCESSFUL', 'transaction': serializer.data}, status=status.HTTP_200_OK)
        except:
            return Response({'status': 'FAILED', 'message': 'Transaction inexistante'},status=status.HTTP_404_NOT_FOUND)
