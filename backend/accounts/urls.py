from django.urls import path
from accounts.views.register import RegisterView
from accounts.views.forgotten_password import ForgottenPasswordView
from accounts.views.verify_email import VerifyEmailView
from accounts.views.login import CookieTokenObtainPairView
from accounts.views.user_details import UserDetailsView
from accounts.views.refresh import CookieTokenRefreshView
from accounts.views.logout import LogoutView
from accounts.views.reset_password import ResetPasswordView

urlpatterns = [
    path("login", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("register", RegisterView.as_view(), name="register"),
    path("forgotten-password", ForgottenPasswordView.as_view(), name="register"),
    path("reset-password", ResetPasswordView.as_view(), name="reset_password"),
    path(
        "verify-email/<uidb64>/<token>",  # TODO : change this to body of the request
        VerifyEmailView.as_view(),
        name="verify_email",
    ),
    path("user", UserDetailsView.as_view(), name="get_user_details"),
    path("logout", LogoutView.as_view(), name="log_out"),
]
