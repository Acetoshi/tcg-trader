from django.contrib.auth import get_user_model
from rest_framework import serializers
from modules.trades.models import TradeTransaction, TradeStatus
from modules.card_collections.models import UserCardCollection

User = get_user_model()


class CreateTradeSerializer(serializers.Serializer):
    partnerUsername = serializers.CharField()
    offeredCardCollectionId = serializers.IntegerField()
    requestedCardCollectionId = serializers.IntegerField()

    def validate_partnerUsername(self, value):
        if not User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This user doesn't exist")
        return value

    def validate_offeredCardCollectionId(self, value):
        if not UserCardCollection.objects.filter(id=value).exists():
            raise serializers.ValidationError("Offered card doesn't exist")
        return value

    def validate_requestedCardCollectionId(self, value):
        if not UserCardCollection.objects.filter(id=value).exists():
            raise serializers.ValidationError("Requested card doesn't exist")
        return value

    def create(self, validated_data):
        initiator = self.context["user"]
        partner = User.objects.get(username=validated_data["partnerUsername"])
        offered = UserCardCollection.objects.get(id=validated_data["offeredCardCollectionId"])
        requested = UserCardCollection.objects.get(id=validated_data["requestedCardCollectionId"])

        trade = TradeTransaction.objects.create(
            initiator=initiator,
            partner=partner,
            offered=offered,
            requested=requested,
            status=TradeStatus.objects.get(code="Pending"),
        )

        return trade
