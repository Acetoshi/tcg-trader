from rest_framework import serializers
from cards.models import Card
from cards.serializers.illustrators import IllustratorSerializer
from cards.serializers.card_images import CardImageSerializer
from cards.serializers.rarity import RaritySerializer
from cards.serializers.set import SetSerializer

class CardSerializer(serializers.ModelSerializer):
    illustrator = IllustratorSerializer() 
    rarity = RaritySerializer()
    set= SetSerializer()
    image = CardImageSerializer(many=True)

    class Meta:
        model = Card
        fields = '__all__'  # Include all fields from the Card model