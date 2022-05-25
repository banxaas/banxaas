from django.contrib import admin
from .models import *
from rest_framework.authtoken.models import Token

admin.site.register(User)
admin.site.register(Token)
admin.site.register(Ad)
admin.site.register(Trade)