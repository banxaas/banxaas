import os, dotenv
from pprint import pprint
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http.request import HttpHeaders
import requests

def set_headers(auth_headers={}):
    dotenv.load_dotenv()
    httpHeaders: HttpHeaders = {'Api-Key': str(os.getenv('API_KEY')),**auth_headers}
    return httpHeaders

def setResponse(request):
    try: 
        print(" request ", request)
        body = request.json()
        headers = request.headers
        response = Response(body)
        response.headers = headers
        response['Content-Type'] = 'application/json'
        return response
    except:
        print("error")

@api_view(['POST'])
def Connexion(request):
    return setResponse(requests.post(os.getenv('BACKEND_URL')+'api/connexion/', data=request.data, headers=set_headers()))


@api_view(['POST'])
def CreateAccount(request):
    return setResponse(requests.post(os.getenv('BACKEND_URL')+'api/createAccount/', data=request.data, headers=set_headers()))


@api_view(['POST'])
def ValidateCode(request):
    return setResponse(requests.post(os.getenv('BACKEND_URL')+'api/validateCode/', data=request.data, headers=set_headers()))

@api_view(['POST'])
def SendValidationCode(request):
    return setResponse(requests.post(os.getenv('BACKEND_URL')+'api/sendNewCodeValidation/', data=request.data, headers=set_headers()))

@api_view(['POST'])
def Deconnexion(request):
   
    auth_headers={'Authorization':request.headers.get('Authorization'),'Signature':request.headers.get('Signature')}
    return setResponse(requests.post(os.getenv('BACKEND_URL')+'api/disconnect/', data=request.data, headers=set_headers(auth_headers=auth_headers)))


@api_view(['POST'])
def isDisconnected(request):
    return setResponse(requests.post(os.getenv('BACKEND_URL')+'api/isDisconnected/', data=request.data, headers=set_headers()))


@api_view(['PATCH'])
def user(request):
    auth_headers={'Authorization':request.headers.get('Authorization'),'Signature':request.headers.get('Signature')}
    return setResponse(requests.patch(os.getenv('BACKEND_URL')+'api/user/', data=request.data, headers=set_headers(auth_headers=auth_headers)))


@api_view(['POST', 'DELETE'])
def PaymentMethod(request):
    auth_headers={'Authorization':request.headers.get('Authorization'),'Signature':request.headers.get('Signature')}
    if request.method == "POST":
        return setResponse(requests.post(os.getenv('BACKEND_URL')+'api/paymentMethod/', data=request.data, headers=set_headers(auth_headers=auth_headers)))
    elif request.method == "DELETE":
        return setResponse(requests.delete(os.getenv('BACKEND_URL')+'api/paymentMethod/', data=request.data, headers=set_headers(auth_headers=auth_headers)))


@api_view(['POST', 'DELETE'])
def Ad(request):
    auth_headers={'Authorization':request.headers.get('Authorization'),'Signature':request.headers.get('Signature')}
    if request.method == "POST":
        return setResponse(requests.post(os.getenv('BACKEND_URL')+'api/ad/', data=request.data, headers=set_headers(auth_headers=auth_headers)))
    elif request.method == "DELETE":
        return setResponse(requests.delete(os.getenv('BACKEND_URL')+'api/ad/', data=request.data, headers=set_headers(auth_headers=auth_headers)))


@api_view(['GET'])
def Ads(request, page):
    auth_headers={'Authorization':request.headers.get('Authorization'),'Signature':request.headers.get('Signature')}
    return setResponse(requests.get(os.getenv('BACKEND_URL')+f'api/ads/{page}/',headers=set_headers(auth_headers=auth_headers)))


@api_view(['POST'])
def InitTrade(request):
    auth_headers={'Authorization':request.headers.get('Authorization'),'Signature':request.headers.get('Signature')}
    return setResponse(requests.post(os.getenv('BACKEND_URL')+'api/trade/init/', data=request.data, headers=set_headers(auth_headers=auth_headers)))
