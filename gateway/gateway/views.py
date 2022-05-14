from pprint import pprint
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests


@api_view(['POST'])
def Connexion(request):
	return Response(requests.post('http://backend:27543/api/connexion/', data=request.data).json())

@api_view(['POST'])
def CreateAccount(request):
	return Response(requests.post('http://backend:27543/api/createAccount/', data=request.data).json())

@api_view(['POST'])
def ValidateCode(request):
	return Response(requests.post('http://backend:27543/api/validateCode/', data=request.data).json())

@api_view(['POST'])
def isDisconnected(request):
	return Response(requests.post('http://backend:27543/api/isDisconnected/', data=request.data).json())
