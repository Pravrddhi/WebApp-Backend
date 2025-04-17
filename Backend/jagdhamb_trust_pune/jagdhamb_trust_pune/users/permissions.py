from rest_framework.permissions import BasePermission
from rest_framework import exceptions
import jwt

from django.contrib.auth import get_user_model

from .utils import jwt_decoder
from .models import JWT, RoleStatusChoice


class IsUserAuthenticated(BasePermission):
    def has_permission(self, request, view):
        message = "You are not Allowed"
        if request.user.is_authenticated:
            return True

        auth_header = request.headers.get("Authorization", None)

        if not auth_header:
            raise exceptions.PermissionDenied(message)
        if "JWT" not in auth_header:
            raise exceptions.PermissionDenied(message)
        try:
            decoder = jwt_decoder(auth_header[4:])
        except jwt.ExpiredSignatureError:
            raise exceptions.PermissionDenied({"message": "Token Expired", "logout": True})
        except jwt.InvalidSignatureError:
            raise exceptions.PermissionDenied({"message": "Error Decoding Token", "logout": True})

        if not decoder:
            raise exceptions.PermissionDenied(message)
        else:
            user_id = decoder.get("user_id", None)
            try:
                user = get_user_model().objects.get(id=user_id)
            except get_user_model().DoesNotExist:
                raise exceptions.PermissionDenied(message)

            if user.is_active and user.role != RoleStatusChoice.ADMIN:
                return True
            else:
                raise exceptions.PermissionDenied(message)