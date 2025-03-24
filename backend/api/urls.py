from django.urls import include, path
from rest_framework import routers
from api.auth.views.login import CookieTokenObtainPairView
from api.auth.views.refresh import CookieTokenRefreshView

from api.auth.views.users import UserViewSet, GroupViewSet
from api.auth.views.register import RegisterView
from api.auth.views.verify_email import VerifyEmailView

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
    path("api/auth/verify-email/<uidb64>/<token>/", VerifyEmailView.as_view(), name="verify_email"),
]
