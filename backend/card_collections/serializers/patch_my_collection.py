from rest_framework import serializers
from card_collections.models import UserCardCollection
from cards.models import Card, Language


class PatchMyCollectionSerializer(serializers.ModelSerializer):
    cardId = serializers.PrimaryKeyRelatedField(
        source="card", queryset=Card.objects.all(), required=True
    )
    languageId = serializers.PrimaryKeyRelatedField(
        source="language", queryset=Language.objects.all(), required=True
    )
    quantityOwned = serializers.IntegerField(source="quantity_owned", required=False, min_value=0)
    quantityForTrade = serializers.IntegerField(
        source="quantity_for_trade", required=False, min_value=0
    )
    desiredQuantity = serializers.IntegerField(
        source="desired_quantity", required=False, min_value=0
    )

    class Meta:
        model = UserCardCollection
        fields = [
            "cardId",
            "languageId",
            "quantityOwned",
            "quantityForTrade",
            "desiredQuantity",
        ]
