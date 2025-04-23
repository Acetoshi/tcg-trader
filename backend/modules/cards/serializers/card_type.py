from rest_framework import serializers
from modules.cards.models import CardType


class CardTypeSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)

    class Meta:
        model = CardType
        fields = ["code", "name"]
