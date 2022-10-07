import os, dotenv
from pprint import pprint
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http.request import HttpHeaders
import requests

def setApiKey():
    dotenv.load_dotenv()
    httpHeaders: HttpHeaders = {'Api-Key': str(os.getenv('API_KEY'))}
    return httpHeaders

@api_view(['POST'])
def Connexion(request):
    return Response(requests.post(os.getenv('BACKEND_URL')+'api/connexion/', data=request.data, headers=setApiKey()).json())


@api_view(['POST'])
def CreateAccount(request):
    return Response(requests.post(os.getenv('BACKEND_URL')+'api/createAccount/', data=request.data, headers=setApiKey()).json())


@api_view(['POST'])
def ValidateCode(request):
    return Response(requests.post(os.getenv('BACKEND_URL')+'api/validateCode/', data=request.data, headers=setApiKey()).json())

@api_view(['POST'])
def SendValidationCode(request):
    return Response(requests.post(os.getenv('BACKEND_URL')+'api/sendNewCodeValidation/', data=request.data, headers=setApiKey()).json())

@api_view(['POST'])
def Deconnexion(request):
    return Response(requests.post(os.getenv('BACKEND_URL')+'api/disconnect/', data=request.data, headers=setApiKey()).json())


@api_view(['POST'])
def isDisconnected(request):
    return Response(requests.post(os.getenv('BACKEND_URL')+'api/isDisconnected/', data=request.data, headers=setApiKey()).json())


@api_view(['PATCH'])
def user(request):
    return Response(requests.patch(os.getenv('BACKEND_URL')+'api/user/', data=request.data, headers=setApiKey()).json())


@api_view(['POST', 'DELETE'])
def PaymentMethod(request):
    if request.method == "POST":
        return Response(requests.post(os.getenv('BACKEND_URL')+'api/paymentMethod/', data=request.data, headers=setApiKey()).json())
    elif request.method == "DELETE":
        return Response(requests.delete(os.getenv('BACKEND_URL')+'api/paymentMethod/', data=request.data, headers=setApiKey()).json())


@api_view(['POST', 'DELETE'])
def Ad(request):
    if request.method == "POST":
        return Response(requests.post(os.getenv('BACKEND_URL')+'api/ad/', data=request.data, headers=setApiKey()).json())
    elif request.method == "DELETE":
        return Response(requests.delete(os.getenv('BACKEND_URL')+'api/ad/', data=request.data, headers=setApiKey()).json())


@api_view(['POST'])
def Ads(request, page):
    return Response(requests.post(os.getenv('BACKEND_URL')+f'api/ads/{page}/', data=request.data, headers=setApiKey()).json())


@api_view(['POST'])
def InitTrade(request):
    return Response(requests.post(os.getenv('BACKEND_URL')+'api/trade/init/', data=request.data, headers=setApiKey()).json())
