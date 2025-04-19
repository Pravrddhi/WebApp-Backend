from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.db.models import QuerySet
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.generic import DetailView
from django.views.generic import RedirectView
from django.views.generic import UpdateView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt


from .permissions import IsUserAuthenticated
from .models import UserRegister
from .serializers import UserRegisterSerializer
from .models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny

class UserDetailView(LoginRequiredMixin, DetailView):
    model = User
    slug_field = "id"
    slug_url_kwarg = "id"


user_detail_view = UserDetailView.as_view()


class UserUpdateView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    model = User
    fields = ["name"]
    success_message = _("Information successfully updated")

    def get_success_url(self) -> str:
        assert self.request.user.is_authenticated  # type guard
        return self.request.user.get_absolute_url()

    def get_object(self, queryset: QuerySet | None=None) -> User:
        assert self.request.user.is_authenticated  # type guard
        return self.request.user


user_update_view = UserUpdateView.as_view()


class UserRedirectView(LoginRequiredMixin, RedirectView):
    permanent = False

    def get_redirect_url(self) -> str:
        return reverse("users:detail", kwargs={"pk": self.request.user.pk})


user_redirect_view = UserRedirectView.as_view()


class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success":True}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,{"success":False}, status=status.HTTP_400_BAD_REQUEST)

class ExistingUserView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        request_data = request.data
        if not request_data:
            return Response(data={"status": False}, status=status.HTTP_400_BAD_REQUEST)
        request_mobile_number = request_data.get("mobile_number", None)
        users = None
        if request_mobile_number:
            users = UserRegister.objects.filter(mobile_number=request_mobile_number)
        existing_user = False
        if users.exists():
            existing_user = True
        return Response(
            data=dict(existing_user=existing_user), status=status.HTTP_200_OK
        )