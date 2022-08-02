import re
import time
import math
from pprint import pprint
from rest_framework import generics, mixins
from rest_framework.decorators import api_view
from rest_framework.views import APIView

from api.repository.authRepository import *
from api.repository.tradeRepository import *
from .serializers import *


class ConnexionViewset(APIView):

    def post(self, request):
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
        if (not user) or (not user.check_password(password)):
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
        })


class ConnexionRoomName(APIView):

    def post(self, request):
        """ Cette fonction permet de récupérer le chat room de l'utilisateur
            Méthode Autorisée: POST,
            JSON à soumettre: {
                "token": "...", // Type String/Str
                "signature": "..." // Type String/Str
            }
        """
        try:
            if not isAuthenticated(request.data['token'], request.data['signature']):
                return Response({"status": "FAILED", 'message': "Vous devez vous connecter"})

            id_user = User.objects.get(pseudo=jwt.decode(
                request.data['token'], os.environ.get('JWT_SECRET'), algorithms="HS256")['sub']).id

            roomName = hashlib.sha256(str(id_user).encode('utf-8')).hexdigest()
            return Response({"status": "SUCCESFUL", "room_name": roomName})
        except:
            return Response({"status": "FAILED", 'message': "Erreur non identifié"})


class Disconnect(APIView):

    def post(self, request):
        """ Cette fonction permet de déconecter l'utilisateur
            Méthode Autorisée: POST,
            JSON à soumettre: {
                "token": "...", // Type String/Str
                "signature": "..." // Type String/Str
            }

        """
        try:
            if not isAuthenticated(request.data['token'], request.data['signature']):
                return Response({"status": "FAILED", 'message': "Vous devez vous connecter"})

            user = User.objects.get(pseudo=jwt.decode(
                request.data['token'], os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
            user.disconnect()
            Token.objects.filter(user=user)[0].delete()
            return Response({"status": "SUCCESSFUL", 'message': "Déconnecté avec succès !"})
        except:
            return Response({"status": "FAILED", 'message': "Erreur non identifié !"})


class CreateAccountViewset(APIView):

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
                return Response({'status': 'FAILED', 'message': 'JSON invalide'})

            if 'email' in keys:
                # L'utilisateur a donné son email
                email = data['email']
                emailRegex = "([A-Za-z0-9]+[._-]?)*[A-Za-z0-9]+@([A-Za-z0-9]+[._-]?)*[A-Za-z0-9]+\\.([A-Z|a-z]{2,})"
                if (not re.match(emailRegex, email)):  # Regex Email Vérification
                    return Response({'status': 'Email Invalide'})
                # Vérification d'un potentiel utilisateur avec cet email
                userExist, response = verifyUser(email)
            else:
                # L'utilisateur a donné son phone
                phone = data['phone']
                # Regex Phone Verification
                phoneRegex = "^(77|78|75|70|76)[0-9]{7}$"
                if (not re.match(phoneRegex, phone)):
                    return Response({'status': 'Phone Invalide'})
                # Vérification d'un potentiel utilisateur avec ce mail
                userExist, response = verifyUser(data['phone'])
            if userExist:
                return response
            serializer = CreateAccountSerializer(data=data)  # Sérialisation
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
            return Response(
                {'status': 'FAILED', 'message': "Vérifier votre connexion, Si l'erreur persiste, contactez moi!"})


class ValidateCodeViewset(APIView):

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
                request.data['code'], request.data['token'])
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
            return Response({'status': "FAILED",
                            'message': 'Token ou Code Invalide, Vérifier que vous avez récupéré le token de validation'})


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
                return Response({'status': "FAILED", 'message': "JSON invalide"})
            token = request.data['token']

            # Vérifie si l'utilisateur est connecté
            if not isAuthenticated(token, request.data['signature']):
                return Response({"status": "FAILED", 'message': "Vous devez vous connecter"})

            # Verification existence PM
            if self.verifyExistingPm(request.data['name'], request.data['phone']):
                return Response({'status': "FAILED", "message": "Payment Method already exists!"})

            user = User.objects.get(pseudo=jwt.decode(token, os.environ.get('JWT_SECRET'), algorithms="HS256")[
                'sub']).id  # Récupération du User
            data = {
                'user': user, 'name': request.data['name'], 'phone': request.data['phone']}
            # Sérialisation
            serializer = PaymentMethodSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                data = serializer.data
                data['id'] = PaymentMethod.objects.get(
                    name=data['name'], phone=data['phone']).id
                return Response({'status': "SUCCESSFUL", "paymentMethod": PaymentMethodForConnSerializer(data).data})
            return Response({'status': "FAILED", "message": "Types des données du JSON invalides!"})
        except:
            return Response({'status': "FAILED", "message": "Token ou Signature Invalide"})

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
                return Response({'status': "FAILED", "message": "JSON invalide"})
            token = request.data['token']
            # Vérifie si l'utilisateur est connecté
            if not isAuthenticated(token, request.data['signature']):
                return Response({"status": "FAILED", "message": "Vous devez vous connecter"})
            pm = PaymentMethod.objects.get(id=int(request.data['id']))
            pm.delete()
            return Response({'status': "SUCCESSFUL"})
        except Exception as e:
            return Response({'status': "FAILED", "message": "Token ou Signature Invalide"})


class UserViewset(APIView):

    def patch(self, request):
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
            data = request.data.copy()
            keys = list(data.keys())

            # Validité des éléments
            if len(data) > 7:
                return Response({'status': "FAILED", "message": "JSON invalide"})

            token = data['token']  # Récupération du Token

            # Vérifie si l'utilisateur est connecté
            if not isAuthenticated(token, data['signature']):
                return Response({"status": "FAILED", "message": "Vous devez vous connecter"})

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
                    return Response({'status': 'Email Invalide'})

            if ('phone' in keys) and (user.phone != str(data['phone'])):
                phoneExist, response = verifyUser(data['phone'])
                if phoneExist:
                    return response
                phoneRegex = "^(77|78|75|70|76)[0-9]{7}$"
                if not re.match(phoneRegex, str(data['phone'])):
                    return Response({'status': 'Phone Invalide'})

            if (('password' in keys) and ('newPassword' not in keys)) or (
                    ('newPassword' in keys) and ('password' not in keys)):
                return Response(
                    {"status": "FAILED", "message": " Les deux champs password et newPassword sont obligatoires"})

            if ('password' in keys) and ('newPassword' in keys):
                if user.check_password(data['password']):
                    data['password'] = make_password(data['newPassword'])
                    data.pop('newPassword')
                else:
                    return Response({'status': "FAILED", 'message': "Mot de passe incorrect !"})

            # Nettoyage de data
            data.pop('token')
            data.pop('signature')

            # sérialisation
            serializer = SetAccountSerializer(user, data=data, partial=True)
            if not serializer.is_valid():
                # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                return Response({"status": "FAILED", "message": "Les Types des données du JSON sont invalides"})

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
            return Response(
                {"status": "FAILED", "message": "Token ou Signature Invalide ou Vous n'etes pas connecté à internet"})


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
            token = data['token']  # Récupération du Token

            # Vérifie si l'utilisateur est connecté
            if not isAuthenticated(token, data['signature']):
                return Response({"status": "FAILED", "message": "Vous devez vous connecter"})

            # Nettoyage de data
            data.pop('token')
            data.pop('signature')

            keys = list(data.keys())
            fields = ['sens', 'quantityType', 'quantityFixe', 'quantityMin', 'quantityMax', 'amountType', 'amountFixe',
                      'amountMin', 'amountMax', 'marge', 'provider']

            # Donnée en plus
            for key in keys:
                if key not in fields:
                    return Response({"status": "FAILED", "message": "JSON invalide"})

            # Vérification de la conformité des données
            if data['quantityType'] != data['amountType']:
                return Response(
                    {"status": "FAILED", "message": "quantityType et amountType ne peuvent pas être différents"})
            if (data['quantityType'] == 'F') and (('quantityFixe' not in keys) or ('amountFixe' not in keys)):
                return Response({"status": "FAILED",
                                 "message": "Quand le type est fixe, les champs quantityFixe et amountFixe deviennent Obligatoires"})
            if (data['quantityType'] == 'F') and (
                    ('quantityMin' in keys) or ('quantityMax' in keys) or ('amountMin' in keys) or (
                    'amountMax' in keys)):
                return Response({"status": "FAILED",
                                 "message": "Quand le type est fixe, les champs (quantityMin, quantityMax, amountMin, amountMax) ne doivent pas figurer dans le JSON"})
            if (data['quantityType'] == 'R') and (
                    ('quantityMin' not in keys) or ('quantityMax' not in keys) or ('amountMin' not in keys) or (
                    'amountMax' not in keys)):
                return Response({"status": 'FAILED',
                                 "message": "Quand le type est range, les champs (quantityMin, quantityMax, amountMin, amountMax) deviennent Obligatoires"})
            if (data['quantityType'] == 'R') and (('quantityFixe' in keys) or ('quantityFixe' in keys)):
                return Response({"status": 'FAILED',
                                 "message": "Quand le type est range, les champs quantityFixe et amountFixe ne doivent pas figurer dans le JSON"})
            if (data['quantityType'] == 'R') and (
                    (float(data['quantityMin']) >= float(data['quantityMax'])) or (float(data['amountMin']) >= float(data['amountMax']))):
                return Response({"status": 'FAILED',
                                 "message": "Les valeurs quantityMin et amountMin ne peuvent pas être supérieur à quantityMax et amountMax"})

            # Récupération de user
            user = User.objects.get(pseudo=jwt.decode(
                token, os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
            data['user'] = user.id  # ajout de user dans data
            serializer = AdSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response({'status': "SUCCESSFUL"})
            return Response({'status': "FAILED", "message": "Types des données du JSON invalides!"})
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
            data = request.data.copy()
            if len(data) != 3:
                return Response({"status": "FAILED", "message": "JSON invalide"})

            token = data['token']  # Récupération du Token
            # Vérifie si l'utilisateur est connecté
            if not isAuthenticated(token, data['signature']):
                return Response({"status": "FAILED", "message": "Vous devez vous connecter"})

            # Nettoyage de data
            data.pop('token')
            data.pop('signature')
            user = User.objects.get(pseudo=jwt.decode(
                token, os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
            ad = Ad.objects.get(id=int(request.data['id']), user=user.id)
            ad.delete()
            return Response({'status': "SUCCESSFUL"})
        except:
            return Response({'status': "FAILED", "message": "Token ou Signature invalide"})


class AdsViewset(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = Ad.objects.filter(status="I")
    serializer_class = AdsSerializer

    def post(self, request, page):
        # try:
        if page < 1:
            return Response({"status": "FAILED", "message": "L'iindice de page minimal est 1"})
        token = request.data['token']  # Récupération du Token
        # Vérifie si l'utilisateur est connecté
        if not isAuthenticated(token, request.data['signature']):
            return Response({"status": "FAILED", "message": "Vous devez vous connecter"})
        self.queryset = Ad.objects.order_by(
            '-publicationDate')[(page - 1) * 10:10 * page]
        return self.list(request)
    # except:
        return Response({"status": "FAILED", "message": "Token ou Signature Invalide"})


class InitTradeSerializer(APIView):

    def post(self, request):
        """
        Permet d'initialiser un trade
        Méthode: POST,
        JSON: {
            "token": "...", // Type String/str
            "signature":"...", // Type String/str
            "adId": ... // Type Interger/Int
        }
        """

        try:

            # Vérifie si l'utilisateur est connecté
            if not isAuthenticated(request.data['token'], request.data['signature']):
                return Response({"status": "FAILED", "message": "Vous devez vous connecter"})

            # Vérifie si l'utilisateur ne trade pas son propre offre
            trader = User.objects.get(pseudo=jwt.decode(
                request.data['token'], os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
            ad = Ad.objects.get(id=request.data['adId'])

            if ad.user == trader:
                return Response({"status": "FAILED", "message": "Il s'agit de votre propre offre !"})

            # Mise à jour de l'état de l'annonce
            ad = Ad.objects.get(id=request.data['adId'])
            if ad.status != "I":
                return Response({"status": "FAILED", "message": "Désolé cet annonce n'est plus disponible !"})
            ad.status = "C"
            ad.save()

            # Récupération des élements du trade
            trader = User.objects.get(pseudo=jwt.decode(
                request.data['token'], os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
            walletAddress = bdk_generate_address()

            # Initialisation du trade
            trade = Trade.objects.create(
                trader=trader, ad=ad, walletAddress=walletAddress)

            # Mise à jour du tradeHash
            startingDate = math.log2(int(str(trade.startingDate.day) + str(trade.startingDate.month) + str(trade.startingDate.year) + str(
                trade.startingDate.hour) + str(trade.startingDate.minute) + str(trade.startingDate.second) + str(trade.startingDate.microsecond))-1)
            pprint(startingDate)
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
            trade.steps = "2"
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

            # Reponse
            return Response({'status': 'SUCCESSFUL', 'tradeHash': tradeHash, 'tradeId': trade.id, "step": 1})

        except:
            return Response({'status': 'FAILED', 'message': 'JSON invalide, si le problème persiste contacte moi !'})
