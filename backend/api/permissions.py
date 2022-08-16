from rest_framework.permissions import BasePermission
from rest_framework.exceptions import APIException
from rest_framework import status
from api.repository.authRepository import *

class IsAuthenticatedPermission(BasePermission):
    message = 'User is not superuser'

    def has_permission(self, request, view):
        return isAuthenticated(request.data.get('token'), request.data.get('signature'))
class NeedLogin(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = {"status": "FAILED", 'message': "Vous devez vous connecter"}
       