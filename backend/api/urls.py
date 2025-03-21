from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from tutorial.quickstart import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('api/', include(router.urls)),
    path("api/token", TokenObtainPairView.as_view(), name="token_obtain_pair"),  # Get JWT
    path("api/token/refresh", TokenRefreshView.as_view(), name="token_refresh"),  # Refresh JWT
]