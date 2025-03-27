from rest_framework import serializers
from cards.models import Rarity

class CardImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rarity
        fields = ['url','language_id']