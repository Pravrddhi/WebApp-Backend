from allauth.account.decorators import secure_admin_login
from django.conf import settings
from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.utils.translation import gettext_lazy as _

from .forms import UserAdminChangeForm
from .forms import UserAdminCreationForm
from .models import User, UserRegister

if settings.DJANGO_ADMIN_FORCE_ALLAUTH:
    # Force the `admin` sign in process to go through the `django-allauth` workflow:
    # https://docs.allauth.org/en/latest/common/admin.html#admin
    admin.autodiscover()
    admin.site.login = secure_admin_login(admin.site.login)  # type: ignore[method-assign]


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (_("Personal info"), {"fields": ("name",)}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    list_display = ["email", "name", "is_superuser"]
    search_fields = ["name"]
    ordering = ["id"]
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )

@admin.register(UserRegister)
class UserRegisterAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {"fields": ("first_name", "last_name", "gender")}),
        (_("Personal Info"), {
            "fields": (
                "date_of_birth",
                "age",
                "mobile_number",
                "experience_years",
                "experience_pathak_name"
                "emergency_contact",
                "blood_group",
                "instrument",
                "address"
            )
        }),
        (_("Status Info"), {
            "fields": (
                "soft_delete",
                "created_at",
                "updated_at",
                "updated_by",
            )
        }),
    )

    readonly_fields = ("created_at", "updated_at")
    list_display = ["first_name", "last_name", "mobile_number", "gender", "blood_group", "soft_delete"]
    search_fields = ["first_name", "last_name", "mobile_number", "instrument"]
    list_filter = ["gender", "blood_group", "soft_delete"]
    ordering = ["id"]

