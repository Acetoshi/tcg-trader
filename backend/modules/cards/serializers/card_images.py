from rest_framework import serializers
from modules.cards.models import CardImage


class CardImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardImage
        fields = ["url", "language_id"]
