import smtplib
from pprint import pprint
import random
import os, hashlib, jwt
from api.models import *
from rest_framework.response import Response
from datetime import datetime, timedelta
import http.client
import json
from api.externe.OrangeSmsApiToken import verifyExistingToken


messageEmail = """From: Yite Verification <mailtestyite@gmail.com>
To: <UserMail>
MIME-Version: 1.0
Content-type: text/html
Subject: Code de validation

Votre code de validation est : <b> ValidationCode </b>
""".encode('utf-8')

messageSms = "[ Banxaas ] Votre code de validation est : "


def verifyUser(pseudo, login):
	if User.objects.filter(pseudo=pseudo):
		return [True, Response({'status': "FAILED", 'message': 'Pseudo already exists'})]
	if User.objects.filter(email=login):
		return [True, Response({'status': "FAILED", 'message': 'Email already exists'})]
	if User.objects.filter(phone=login):
		return [True, Response({'status': "FAILED", 'message': 'Phone already exists'})]
	return [False, ""]


def createValidationTokenPayload(code, userId, userIdType):
	creationDate = datetime.now(timezone.utc)
	expirationDate = creationDate + timedelta(seconds=300)
	tokenId = str(creationDate) + str(code) + str(userId) + str(expirationDate)
	tokenId  = hashlib.sha256(tokenId.encode('utf-8')).hexdigest()
	payload = {
		"tokenId": tokenId, 
		"userId": userId, 
		"userIdType": userIdType,
		"xd" : str(creationDate), 
		"yd": str(expirationDate),
		"iat": datetime.now(timezone.utc),
		"exp": datetime.now(timezone.utc) + timedelta(seconds=300)
	}
	return payload

def createCode():
	return ''.join(random.choices([str(i) for i in range(10)], k=6))


def sendVerificationCodeByMail(userMail):
	server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
	server.login("mailtestyite@gmail.com", "yitetechtest")
	sender = 'mailtestyite@gmail.com'
	receivers = [userMail]
	code = createCode()
	mail = str(messageEmail.decode('utf-8')).replace("UserMail", userMail).replace("ValidationCode", code)
	mail = bytes(mail.encode('utf-8'))
	server.sendmail(sender, userMail, mail)
	server.quit()
	return code

def sendVerificationCodeBySms(userPhone):
	token = verifyExistingToken()
	code = createCode()
	conn = http.client.HTTPSConnection("api.orange.com")
	payload = json.dumps({
	  "outboundSMSMessageRequest": {
	    "address": f"tel:+221{userPhone}",
	    "senderAddress": "tel:+221777023861",
	    "outboundSMSTextMessage": {
	      "message": messageSms + code
	    }
	  }
	})
	headers = {
	  'Content-Type': 'application/json',
	  'Authorization': f"{token['token_type']} {token['access_token']}"
	}
	conn.request("POST", "/smsmessaging/v1/outbound/tel%3A%2B221777023861/requests", payload, headers)
	res = conn.getresponse()
	data = res.read()
	return code

def verifyCodeValidation(code, token):
	key = os.environ.get('JWT_SECRET')
	try:
		tokenDecoded = jwt.decode(token, key, algorithms="HS256")
	except:
		return [False, ""]
	creationDate = tokenDecoded['xd']
	expirationDate = tokenDecoded['yd']
	userId = tokenDecoded['userId']
	tokenId = str(creationDate) + str(code) + str(userId) + str(expirationDate)
	tokenId  = hashlib.sha256(tokenId.encode('utf-8')).hexdigest()
	if tokenId != tokenDecoded['tokenId']:
		return [False, ""]
	return [True, userId]
