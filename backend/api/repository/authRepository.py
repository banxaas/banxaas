import hashlib
import http.client
import json
import jwt
import os
import random
import smtplib
import ssl
from datetime import datetime, timedelta

from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from api.externe.OrangeSmsApiToken import verifyExistingToken
from api.models import *


def isRequestDataConnexionValid(data):
    """ Cette fonction permet de vérifier si les
    informations fournit lors de la connexion sont exploitables! """
    if len(data) != 2:
        return False
    try:
        login = data['login']
        password = data.get('password')
        return [login, password]
    except KeyError:
        return False


def getUserByLogin(login):
    """ Cette fonction permet de récupérer un utilisateur par son pseudo, email ou phone"""
    if User.objects.filter(pseudo=login):
        return User.objects.get(pseudo=login)
    elif User.objects.filter(email=login):
        return User.objects.get(email=login)
    elif User.objects.filter(phone=login):
        return User.objects.get(phone=login)
    else:
        return None  # La foncton retourne None si l'utilisateur n'existe pas !


def verifyUser(login):
    """ Cette fonction permet de vérifier si le pseudo ou le phone ou l'email existe """
    if User.objects.filter(pseudo=login):
        return [True, Response({'status': "FAILED", 'message': 'Pseudo already exists'})]
    if User.objects.filter(email=login):
        return [True, Response({'status': "FAILED", 'message': 'Email already exists'})]
    if User.objects.filter(phone=login):
        return [True, Response({'status': "FAILED", 'message': 'Phone already exists'})]
    return [False, ""]


def createToken(payload):
    # Permet de créer un token JWT
    return jwt.encode(payload, os.environ.get('JWT_SECRET'), algorithm="HS256")


# jwt.decode(encoded, key, algorithms="HS256")

def createCode():
    """ Permet de créer un code de validation"""
    return ''.join(random.choices([str(i) for i in range(10)], k=6))


messageEmail = f"""From: Yite Verification <{str(os.environ.get('MAIL_BANXAAS'))}>
To: <UserMail>
MIME-Version: 1.0
Content-type: text/html
Subject: Code de validation

Votre code de validation est : <b> ValidationCode </b>
""".encode('utf-8')

messageSms = "[ Banxaas ] Votre code de validation est : "


def sendVerificationCodeByMail(userMail):
    """Permet d'envoyer un code de validation par email"""
    # Connexion au server
    server = smtplib.SMTP(str(os.environ.get('MAIL_SERVER_HOST')), int(os.environ.get('MAIL_SERVER_PORT')))
    context = ssl.create_default_context()
    server.starttls(context=context)
    server.login(str(os.environ.get('MAIL_BANXAAS')), str(os.environ.get('PASSWORD_MAIL_BANXAAS')))
    # Création du code de validation
    code = createCode()
    # Préparation du mail
    sender = str(os.environ.get('MAIL_BANXAAS'))
    receivers = [userMail]
    mail = str(messageEmail.decode('utf-8')).replace("UserMail", userMail).replace("ValidationCode", code)
    mail = bytes(mail.encode('utf-8'))
    # Envoie !!
    server.sendmail(sender, userMail, mail)
    server.quit()  # Déconnexion
    return code


def sendVerificationCodeBySms(userPhone):
    """Permet d'envoyer un code de validation par phone"""
    token = verifyExistingToken()  # Vérification d'un token API ORANGE existant
    code = createCode()  # Création du code de validation
    conn = http.client.HTTPSConnection("api.orange.com")  # Initialisation de la connexion
    payload = json.dumps({
        "outboundSMSMessageRequest": {
            "address": f"tel:+221{userPhone}",
            "senderAddress": "tel:+221774924730",
            "outboundSMSTextMessage": {
                "message": messageSms + code
            }
        }
    })
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f"{token['token_type']} {token['access_token']}"
    }
    # Envoie du Code
    conn.request("POST", "/smsmessaging/v1/outbound/tel%3A%2B221774924730/requests", payload, headers)
    res = conn.getresponse()
    data = res.read()
    return code


def createValidationTokenPayload(code, userId, userIdType):
    """ Permet de créer un Payload pour le JWT """
    creationDate = datetime.now(timezone.utc)
    expirationDate = creationDate + timedelta(seconds=300)
    token = str(creationDate) + str(code) + str(userId) + str(expirationDate)
    token = hashlib.sha256(token.encode('utf-8')).hexdigest()
    payload = {
        "token": token,
        "userId": userId,
        "userIdType": userIdType,
        "xd": str(creationDate),
        "yd": str(expirationDate),
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(seconds=300)
    }
    return payload


def verifyCodeValidation(code, token):
    """ Permet de Vérifier la validité du token """
    try:
        tokenDecoded = jwt.decode(token, os.environ.get('JWT_SECRET'), algorithms="HS256")
    except:
        return [False, ""]
    creationDate = tokenDecoded['xd']
    expirationDate = tokenDecoded['yd']
    userId = tokenDecoded['userId']
    tokenId = str(creationDate) + str(code) + str(userId) + str(expirationDate)
    tokenId = hashlib.sha256(tokenId.encode('utf-8')).hexdigest()
    if tokenId != tokenDecoded['token']:
        return [False, ""]
    return [True, userId]


def is_authenticated(token, signature):
    user = User.objects.get(pseudo=jwt.decode(token, os.environ.get('JWT_SECRET'), algorithms="HS256")['sub'])
    if user.is_authenticated and (signature == Token.objects.filter(user=user)[0].key):
        return True
    return False
