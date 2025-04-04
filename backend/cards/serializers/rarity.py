from rest_framework import serializers
from cards.models import Rarity


class RaritySerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)
    imageUrl = serializers.CharField(source="image_url")

    class Meta:
        model = Rarity
        fields = ["code", "name", "imageUrl"]
