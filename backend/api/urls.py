from django.urls import include, path
from rest_framework import routers
from django.contrib import admin

router = routers.DefaultRouter()

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/admin", admin.site.urls),  # do i want this ?
    path("api/auth/", include("accounts.urls")),
    path("api/<str:language_code>/", include("cards.urls")),
    path("api/", include("card_collections.urls")),
]
