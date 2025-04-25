# serializers.py
from rest_framework import serializers
from .models import UserRegister, Instrument

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRegister
        fields = '__all__' 


class InstrumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instrument
        fields = ['id', 'instrumenst_name']