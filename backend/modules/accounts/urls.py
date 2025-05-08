from django.urls import path
from modules.accounts.views.register import RegisterView
from modules.accounts.views.forgotten_password import ForgottenPasswordView
from modules.accounts.views.verify_email import VerifyEmailView
from modules.accounts.views.login import LoginView
from modules.accounts.views.user_details import UserDetailsView
from modules.accounts.views.logout import LogoutView
from modules.accounts.views.reset_password import ResetPasswordView

urlpatterns = [
    path("login", LoginView.as_view(), name="login"),
    path("register", RegisterView.as_view(), name="register"),
    path("forgotten-password", ForgottenPasswordView.as_view(), name="forgotten-password"),
    path("reset-password", ResetPasswordView.as_view(), name="reset-password"),
    path(
        "verify-email/<uidb64>/<token>",  # TODO : change this to body of the request
        VerifyEmailView.as_view(),
        name="verify-email",
    ),
    path("user", UserDetailsView.as_view(), name="user-details"),
    path("logout", LogoutView.as_view(), name="logout"),
]
