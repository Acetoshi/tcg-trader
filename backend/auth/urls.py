from django.urls import path

from auth.views.register import RegisterView
from auth.views.verify_email import VerifyEmailView
from auth.views.login import CookieTokenObtainPairView
from auth.views.user_details import UserDetailsView
from auth.views.refresh import CookieTokenRefreshView
from auth.views.logout import LogoutView

urlpatterns = [
    path("login", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("register", RegisterView.as_view(), name="register"),
    path(
        "verify-email/<uidb64>/<token>",
        VerifyEmailView.as_view(),
        name="verify_email",
    ),
    path("user", UserDetailsView.as_view(), name="get_user_details"),
    path("logout", LogoutView.as_view(), name="log_out"),
]
