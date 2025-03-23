from django.urls import include, path
from rest_framework import routers
from api.auth.views.login import CookieTokenObtainPairView
from api.auth.views.refresh import CookieTokenRefreshView

from api.auth.views.users import UserViewSet, GroupViewSet
from api.auth.views.register import RegisterView

router = routers.DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"groups", GroupViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("api/", include(router.urls)),
    path(
        "api/auth/login", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"
    ),
    path("api/auth/refresh", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/register", RegisterView.as_view(), name="register"),
]
