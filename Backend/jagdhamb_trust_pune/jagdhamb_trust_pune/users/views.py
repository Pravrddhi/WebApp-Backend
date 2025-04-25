from django.utils.translation import gettext_lazy as _
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserRegister, UserInstruments, Instrument
from .serializers import UserRegisterSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny



class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        phone = request.data.get('mobile_number')
        instruments = request.data.get('instrument', [])

        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response({"errors": serializer.errors, "status": False}, status=status.HTTP_400_BAD_REQUEST)
        user = UserRegister.objects.get(mobile_number=phone)
        if isinstance(instruments, list):
            UserInstruments.objects.filter(user=user).delete()
            for name in instruments:
                instrument, _ = Instrument.objects.get_or_create(instrumenst_name=name)
                UserInstruments.objects.get_or_create(user=user, instrument=instrument)

        # Return response with user data and whether the user was newly created
        return Response({"status": True}, status=status.HTTP_201_CREATED)

class ExistingUserView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        request_data = request.data
        if not request_data:
            return Response(data={"status": False}, status=status.HTTP_400_BAD_REQUEST)
        request_mobile_number = request_data.get("mobile_number", None)
        try:
            users = None
            if request_mobile_number:
                users = UserRegister.objects.filter(mobile_number=request_mobile_number)
            existing_user = False
            if users.exists():
                existing_user = True
            return Response(
                data={"status": existing_user},
                status=status.HTTP_200_OK,)
        except Exception as e:
            print(e)
            return Response(
                data={"status": False},
                status=status.HTTP_400_BAD_REQUEST,
            )