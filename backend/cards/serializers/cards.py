from rest_framework import serializers
from cards.models import Card
from cards.serializers.illustrators import IllustratorSerializer
from cards.serializers.card_images import CardImageSerializer
from cards.serializers.rarity import RaritySerializer

class CardSerializer(serializers.ModelSerializer):
    illustrator = IllustratorSerializer() 
    rarity = RaritySerializer()
    image = CardImageSerializer(many=True)

    class Meta:
        model = Card
        fields = '__all__'  # Include all fields from the Card model