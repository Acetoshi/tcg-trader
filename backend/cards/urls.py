from django.urls import path
from cards.views.cards import CardListView
from cards.views.sets import SetListView
from cards.views.rarities import RarityListView
from cards.views.card_types import CardTypeListView

urlpatterns = [
    path("cards", CardListView.as_view(), name="card-list"),
    path("sets", SetListView.as_view(), name="set-list"),
    path("rarities", RarityListView.as_view(), name="rarity-list"),
    path("card-types", CardTypeListView.as_view(), name="card-type-list"),
]
