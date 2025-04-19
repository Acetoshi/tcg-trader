from rest_framework import serializers
from card_collections.models import UserCardCollection
from cards.models import Card, Language


class PatchMyCollectionSerializer(serializers.ModelSerializer):
    cardId = serializers.PrimaryKeyRelatedField(
        source="card", queryset=Card.objects.all(), required=True
    )
    languageCode = serializers.SlugRelatedField(
        source="language", slug_field="code", queryset=Language.objects.all(), required=True
    )
    owned = serializers.IntegerField(source="quantity_owned", required=False, min_value=0)
    forTrade = serializers.IntegerField(source="quantity_for_trade", required=False, min_value=0)
    wishlist = serializers.IntegerField(source="desired_quantity", required=False, min_value=0)

    class Meta:
        model = UserCardCollection
        fields = [
            "cardId",
            "languageCode",
            "owned",
            "forTrade",
            "wishlist",
        ]
