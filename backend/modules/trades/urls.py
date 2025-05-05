from django.urls import path
from modules.trades.views.opportunities import TradeOpportunitiesView
from modules.trades.views.trades import TradesView
from modules.trades.views.sent_offers import SentTradeOffersView
from modules.trades.views.received_offers import ReceivedTradeOffersView
from modules.trades.views.ongoing_trades import OngoingtradesView


urlpatterns = [
    path("", TradesView.as_view(), name="trades"),
    path("opportunities", TradeOpportunitiesView.as_view(), name="trade-opportunities"),
    path("sent", SentTradeOffersView.as_view(), name="sent-trade-offers"),
    path("received", ReceivedTradeOffersView.as_view(), name="received-trade-offers"),
    path("ongoing", OngoingtradesView.as_view(), name="ongoing-trades"),
]
