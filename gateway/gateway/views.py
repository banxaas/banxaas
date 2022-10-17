import os, dotenv
from pprint import pprint
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http.request import HttpHeaders
import requests

def set_headers(auth_headers={}):
    dotenv.load_dotenv()
    httpHeaders: HttpHeaders = {'Api-Key': str(os.getenv('API_KEY')),**auth_headers}
    print('httpHeaders',httpHeaders)
    return httpHeaders

@api_view(['POST'])
def Connexion(request):
    return Response(requests.post(os.getenv('BACKEND_URL')+'api/connexion/', data=request.data, headers=set_headers()).json())


@api_view(['POST'])
def CreateAccount(request):
    return Response(requests.post(os.getenv('BACKEND_URL')+'api/createAccount/', data=request.data, headers=set_headers()).json())


@api_view(['POST'])
def ValidateCode(request):
    return Response(requests.post(os.getenv('BACKEND_URL')+'api/validateCode/', data=request.data, headers=set_headers()).json())

@api_view(['POST'])
def SendValidationCode(request):
    return Response(requests.post(os.getenv('BACKEND_URL')+'api/sendNewCodeValidation/', data=request.data, headers=set_headers()).json())

@api_view(['POST'])
def Deconnexion(request):
   
    auth_headers={'Authorization':request.headers.get('Authorization'),'AuthorizationSign':request.headers.get('AuthorizationSign')}
    return Response(requests.post(os.getenv('BACKEND_URL')+'api/disconnect/', data=request.data, headers=set_headers(auth_headers=auth_headers)).json())


@api_view(['POST'])
def isDisconnected(request):
    return Response(requests.post(os.getenv('BACKEND_URL')+'api/isDisconnected/', data=request.data, headers=set_headers()).json())


@api_view(['PATCH'])
def user(request):
    auth_headers={'Authorization':request.headers.get('Authorization'),'AuthorizationSign':request.headers.get('AuthorizationSign')}
    return Response(requests.patch(os.getenv('BACKEND_URL')+'api/user/', data=request.data, headers=set_headers(auth_headers=auth_headers)).json())


@api_view(['POST', 'DELETE'])
def PaymentMethod(request):
    auth_headers={'Authorization':request.headers.get('Authorization'),'AuthorizationSign':request.headers.get('AuthorizationSign')}
    if request.method == "POST":
        return Response(requests.post(os.getenv('BACKEND_URL')+'api/paymentMethod/', data=request.data, headers=set_headers(auth_headers=auth_headers)).json())
    elif request.method == "DELETE":
        return Response(requests.delete(os.getenv('BACKEND_URL')+'api/paymentMethod/', data=request.data, headers=set_headers(auth_headers=auth_headers)).json())


@api_view(['POST', 'DELETE'])
def Ad(request):
    auth_headers={'Authorization':request.headers.get('Authorization'),'AuthorizationSign':request.headers.get('AuthorizationSign')}
    if request.method == "POST":
        return Response(requests.post(os.getenv('BACKEND_URL')+'api/ad/', data=request.data, headers=set_headers(auth_headers=auth_headers)).json())
    elif request.method == "DELETE":
        return Response(requests.delete(os.getenv('BACKEND_URL')+'api/ad/', data=request.data, headers=set_headers(auth_headers=auth_headers)).json())


@api_view(['GET'])
def Ads(request, page):
    auth_headers={'Authorization':request.headers.get('Authorization'),'AuthorizationSign':request.headers.get('AuthorizationSign')}
    return Response(requests.get(os.getenv('BACKEND_URL')+f'api/ads/{page}/',headers=set_headers(auth_headers=auth_headers)).json())


@api_view(['POST'])
def InitTrade(request):
    auth_headers={'Authorization':request.headers.get('Authorization'),'AuthorizationSign':request.headers.get('AuthorizationSign')}
    return Response(requests.post(os.getenv('BACKEND_URL')+'api/trade/init/', data=request.data, headers=set_headers(auth_headers=auth_headers)).json())
