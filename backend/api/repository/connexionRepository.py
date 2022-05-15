from api.models import *
from pprint import pprint
import jwt
import os


def isRequestDataConnexionValid(data):
	if len(data) != 2:
		return False
	try:
		login = data['login']
		password = data.get('password')
		return [login, password]
	except KeyError:
		return False


def getUserByLogin(login):
	if User.objects.filter(pseudo=login):
		return User.objects.get(pseudo=login)
	elif User.objects.filter(email=login):
		return User.objects.get(email=login)
	elif User.objects.filter(phone=login):
		return User.objects.get(phone=login)
	else:
		return None


def createToken(payload):
	key = os.environ.get('JWT_SECRET')
	token = jwt.encode(payload, key, algorithm="HS256")
	return token
	#jwt.decode(encoded, key, algorithms="HS256")
