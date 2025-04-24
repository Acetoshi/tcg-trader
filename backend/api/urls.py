from django.urls import include, path
from rest_framework import routers

router = routers.DefaultRouter()

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/auth/", include("modules.accounts.urls")),
    path("api/<str:language_code>/", include("modules.cards.urls")),
    path("api/", include("modules.card_collections.urls")),
    path("api/trades", include("modules.trades.urls")),
]
