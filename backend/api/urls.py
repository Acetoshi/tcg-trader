from django.urls import include, path

urlpatterns = [
    path("api/auth/", include("modules.accounts.urls")),
    path("api/<str:language_code>/", include("modules.cards.urls")),
    path("api/", include("modules.card_collections.urls")),
    path("api/trades/", include("modules.trades.urls")),
    path("api/", include("modules.pokedex.urls")),
    path("api/users/", include("modules.public_profiles.urls")),
]
