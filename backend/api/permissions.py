from rest_framework.permissions import BasePermission
from rest_framework.exceptions import APIException
from rest_framework import status
from api.repository.authRepository import * 
from pprint import pprint

class IsAuthenticatedPermission(BasePermission):
    def has_permission(self, request, view):
        print("kkkk",request.data)
            
        try:
            return isAuthenticated(request.data['token'], request.data['signature'])
        except:
            raise NeedLogin()
class NeedLogin(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = {"status": "FAILED", 'message': "Vous devez vous connecter"}

class CheckApiKeyAuth(BasePermission):
    def has_permission(self, request, view):
        api_key_secret = request.headers.get('Api-Key')
        return api_key_secret == str(os.getenv('API_KEY'))       