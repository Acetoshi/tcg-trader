from django.urls import path
from modules.pokedex.view import PokedexView

urlpatterns = [
    path("pokedex", PokedexView.as_view(), name="pokedex"),
]
