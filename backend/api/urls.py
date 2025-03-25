from django.urls import include, path
from rest_framework import routers

from auth.views.users import UserViewSet, GroupViewSet
from auth.views.register import RegisterView
from auth.views.verify_email import VerifyEmailView
from auth.views.login import CookieTokenObtainPairView
from auth.views.user_details import UserDetailsView
from auth.views.refresh import CookieTokenRefreshView
from auth.views.logout import LogoutView


router = routers.DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"groups", GroupViewSet)


urlpatterns = [
    path("api/", include(router.urls)),
    path(
        "api/auth/login", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"
    ),
    path("api/auth/refresh", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/register", RegisterView.as_view(), name="register"),
    path(
        "api/auth/verify-email/<uidb64>/<token>",
        VerifyEmailView.as_view(),
        name="verify_email",
    ),
    path("api/auth/user", UserDetailsView.as_view(), name="get_user_details"),
    path("api/auth/logout", LogoutView.as_view(), name="log_out"),
]
