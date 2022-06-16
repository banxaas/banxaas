from django.contrib import admin
from rest_framework.authtoken.models import Token

from .models import *

admin.site.register(User)
admin.site.register(PaymentMethod)
admin.site.register(Token)
admin.site.register(Ad)
admin.site.register(Trade)
