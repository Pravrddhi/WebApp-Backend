# serializers.py
from rest_framework import serializers
from .models import UserRegister

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRegister
        fields = '__all__' 
