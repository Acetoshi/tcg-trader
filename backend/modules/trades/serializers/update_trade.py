from rest_framework import serializers
from modules.trades.models import TradeTransaction, TradeStatus


class UpdateTradeSerializer(serializers.ModelSerializer):
    tradeId = serializers.UUIDField(write_only=True, source="id")
    newStatusCode = serializers.CharField(write_only=True, source="status.code")

    class Meta:
        model = TradeTransaction
        fields = ["tradeId", "newStatusCode"]
        extra_kwargs = {"id": {"read_only": True}}

    def validate(self, attrs):
        user = self.context["user"]

        # Make sure the transaction exists
        try:
            trade = TradeTransaction.objects.get(id=attrs["id"])
        except TradeTransaction.DoesNotExist:
            raise serializers.ValidationError({"tradeId": "This transaction doesn't exist."})

        # Make sure the user if part of the transaction
        if trade.initiator_id != user.id and trade.partner_id != user.id:
            raise serializers.ValidationError("You are not authorized to modify this transaction.")

        # Make sure the requested status exists
        try:
            status_obj = TradeStatus.objects.get(code=attrs["status"]["code"])
        except TradeStatus.DoesNotExist:
            raise serializers.ValidationError({"newStatusCode": "Invalid status code."})

        attrs["trade_instance"] = trade
        attrs["status_instance"] = status_obj
        return attrs

    def save(self, **kwargs):
        trade = self.validated_data["trade_instance"]
        status = self.validated_data["status_instance"]

        trade.status = status
        trade.save()
        return trade
