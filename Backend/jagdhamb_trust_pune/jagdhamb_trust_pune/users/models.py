
from typing import ClassVar

from django.contrib.auth.models import AbstractUser
from django.db.models import CharField
from django.db.models import EmailField
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.contrib.postgres.fields import ArrayField

from .managers import UserManager
from django.db import models

class GenderChoice(models.TextChoices):
    M = "MALE"
    F = "FEMALE"
    OTHER = "OTHER"

class BloodGroupChoice(models.TextChoices):
    A_POS = "A+"
    A_NEG = "A-"
    B_POS = "B+"
    B_NEG = "B-"
    AB_POS = "AB+"
    AB_NEG = "AB-"
    O_POS = "O+"
    O_NEG = "O-"

class User(AbstractUser):
    """
    Default custom user model for jagdhamb_trust_pune.
    If adding fields that need to be filled at user signup,
    check forms.SignupForm and forms.SocialSignupForms accordingly.
    """

    # First and last name do not cover name patterns around the globe
    name = CharField(_("Name of User"), blank=True, max_length=255)
    first_name = None  # type: ignore[assignment]
    last_name = None  # type: ignore[assignment]
    email = EmailField(_("email address"), unique=True)
    username = None  # type: ignore[assignment]

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects: ClassVar[UserManager] = UserManager()

    def get_absolute_url(self) -> str:
        """Get URL for user's detail view.

        Returns:
            str: URL for user detail.

        """
        return reverse("users:detail", kwargs={"pk": self.id})

class UserRegister(models.Model):

    first_name = models.CharField(max_length=50, null=False)
    last_name = models.CharField(max_length=50, null=False)
    date_of_birth = models.DateField(null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    mobile_number = models.CharField(max_length=15, unique=True, null=False)
    emergency_contact = models.CharField(max_length=15, null=False)
    blood_group = models.CharField(max_length=5, choices=BloodGroupChoice.choices, null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GenderChoice.choices, null=False)
    address = models.TextField(null=False)
    experience_years = models.FloatField(null=True, blank=True, max_length=2)
    experience_pathak_name = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    soft_delete = models.IntegerField(default=0)  # 0= not deleted,1 = deleted

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
class JWTTokenChoice(models.TextChoices):
    NORMAL = "NORMAL"
    REFRESH = "REFRESH"


class JWT(models.Model):
    STATUS_ACTIVE = 1
    STATUS_EXPIRED = 0
    STATUS = ((STATUS_ACTIVE, "Active"), (STATUS_EXPIRED, "Expired"))

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=256, null=False)
    expires_at = models.DateTimeField(null=False)
    status = models.SmallIntegerField(choices=STATUS, default=STATUS_ACTIVE)
    type = models.CharField(
        max_length=64, choices=JWTTokenChoice.choices, default=JWTTokenChoice.NORMAL
    )

    def __str__(self):
        return f"{self.token}"

    class Meta:
        verbose_name = "JWT"

class RoleStatusChoice(models.TextChoices):
    USER = "USER"
    ADMIN = "ADMIN"


class Instrument(models.Model):
    instrument_id = models.AutoField(primary_key=True)
    instrument_name = models.CharField(max_length=50, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.instrument_name}, {self.instrument_id}"
    
class UserInstruments(models.Model):
    user = models.ForeignKey(UserRegister, on_delete=models.CASCADE)
    instrument = models.ForeignKey(Instrument, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user}, {self.instrument}"
    
