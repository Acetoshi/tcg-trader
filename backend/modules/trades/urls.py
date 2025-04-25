from django.urls import path
from modules.trades.views.opportunities import TradeOpportunitiesView
from modules.trades.views.trades import TradesView


urlpatterns = [
    path("", TradesView.as_view(), name="trades"),
    path("/opportunities", TradeOpportunitiesView.as_view(), name="my_collection"),
]
