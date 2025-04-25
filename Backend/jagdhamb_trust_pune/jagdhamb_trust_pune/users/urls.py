from django.urls import path
from .views import ExistingUserView, RegisterUserView
app_name = "users"
urlpatterns = [
    # path("~redirect/", view=user_redirect_view, name="redirect"),
    # path("~update/", view=user_update_view, name="update"),
    # path("<int:pk>/", view=user_detail_view, name="detail"),
    path("register/", view=RegisterUserView.as_view(), name="register-user"),
    path("existing_user/", view=ExistingUserView.as_view(), name="existing-user"),

]
