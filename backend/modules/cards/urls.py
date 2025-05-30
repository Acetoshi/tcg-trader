from django.urls import path
from modules.cards.views.cards import CardListView
from modules.cards.views.sets import SetListView
from modules.cards.views.rarities import RarityListView
from modules.cards.views.card_types import CardTypeListView
from modules.cards.views.colors import ColorListView

urlpatterns = [
    path("cards", CardListView.as_view(), name="card-list"),
    path("sets", SetListView.as_view(), name="set-list"),
    path("rarities", RarityListView.as_view(), name="rarity-list"),
    path("card-types", CardTypeListView.as_view(), name="card-type-list"),
    path("colors", ColorListView.as_view(), name="color-list"),
]
