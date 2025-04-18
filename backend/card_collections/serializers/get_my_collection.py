from rest_framework import serializers
from card_collections.models import UserCardCollection


class GetMyCollectionSerializer(serializers.ModelSerializer):
    # cardId = serializers.CharField(source="id")
    # languageCode = serializers.CharField(source="language.code")
    # quantityOwned = serializers.CharField(source="quantity_owned")
    # quantityForTrade = serializers.CharField(source="quantity_for_trade")
    # desiredQuantity = serializers.CharField(source="desired_quantity")

    class Meta:
        model = UserCardCollection
        fields = "__all__"
        # [
        #     "cardId",
        #     # "languageCode",
        #     # "quantityOwned",
        #     # "quantityForTrade",
        #     # "desiredQuantity",
        # ]
