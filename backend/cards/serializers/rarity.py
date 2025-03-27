from rest_framework import serializers
from cards.models import Rarity

class RaritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Rarity
        fields = ['code','image_url']