import smtplib
from pprint import pprint
import random
import os, hashlib, jwt
from api.models import *
from rest_framework.response import Response
from datetime import datetime, timedelta


message = """From: Yite Verification <mailtestyite@gmail.com>
To: <UserMail>
MIME-Version: 1.0
Content-type: text/html
Subject: Code de validation

Votre code de validation est : <b> ValidationCode </b>
""".encode('utf-8')


def verifyUser(pseudo, login):
	if User.objects.filter(pseudo=pseudo):
		return [True, Response({'status': "FAILED", 'message': 'Pseudo already exists'})]
	if User.objects.filter(email=login):
		return [True, Response({'status': "FAILED", 'message': 'Email already exists'})]
	if User.objects.filter(phone=login):
		return [True, Response({'status': "FAILED", 'message': 'Phone already exists'})]
	return [False, ""]


def createValidationTokenPayload(code, email):
	creationDate = datetime.now(timezone.utc)
	expirationDate = creationDate + timedelta(seconds=300)
	tokenId = str(creationDate) + str(code) + str(email) + str(expirationDate)
	tokenId  = hashlib.sha256(tokenId.encode('utf-8')).hexdigest()
	payload = {
		"tokenId": tokenId, 
		"email": email, 
		"xd" : str(creationDate), 
		"yd": str(expirationDate),
		"iat": datetime.now(timezone.utc),
		"exp": datetime.now(timezone.utc) + timedelta(seconds=300)
	}
	return payload


def createCode():
	return ''.join(random.choices([str(i) for i in range(10)], k=6))


def sendVerificationCode(userMail):
	server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
	server.login("mailtestyite@gmail.com", "yitetechtest")
	sender = 'mailtestyite@gmail.com'
	receivers = [userMail]
	code = createCode()
	mail = str(message.decode('utf-8')).replace("UserMail", userMail).replace("ValidationCode", code)
	mail = bytes(mail.encode('utf-8'))
	server.sendmail(sender, userMail, mail)
	server.quit()
	return code


def verifyCodeValidation(code, token):
	key = os.environ.get('JWT_SECRET')
	try:
		tokenDecoded = jwt.decode(token, key, algorithms="HS256")
	except:
		return [False, ""]
	creationDate = tokenDecoded['xd']
	expirationDate = tokenDecoded['yd']
	email = tokenDecoded['email']
	pprint(tokenDecoded['tokenId'])
	tokenId = str(creationDate) + str(code) + str(email) + str(expirationDate)
	tokenId  = hashlib.sha256(tokenId.encode('utf-8')).hexdigest()
	if tokenId != tokenDecoded['tokenId']:
		return [False, ""]
	return [True, email]
