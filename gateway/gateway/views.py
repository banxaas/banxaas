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

@api_view(['PATCH'])
def SetUser(request):
	return Response(requests.patch('http://backend:27543/api/setUser/', data=request.data).json())

@api_view(['POST', 'DELETE'])
def PaymentMethod(request):
	if request.method == "POST":
		return Response(requests.post('http://backend:27543/api/paymentMethod/', data=request.data).json())
	elif request.method == "DELETE":
		return Response(requests.delete('http://backend:27543/api/paymentMethod/', data=request.data).json())

@api_view(['POST', 'DELETE'])
def Ad(request):
	if request.method == "POST":
		return Response(requests.post('http://backend:27543/api/ad/', data=request.data).json())
	elif request.method == "DELETE":
		return Response(requests.delete('http://backend:27543/api/ad/', data=request.data).json())

@api_view(['GET'])
def Ads(request, page):
	return Response(requests.get(f'http://backend:27543/api/ads/{page}/', data=request.data).json())
