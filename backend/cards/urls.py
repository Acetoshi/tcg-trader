from django.urls import path
from cards.views.cards import CardListView

urlpatterns = [
    path('', CardListView.as_view(), name='card-list'),
]