from rest_framework import serializers
from cards.models import PokemonCardDetails
from cards.serializers.pokemon import PokemonSerializer


class PokemonCardDetailsSerializer(serializers.ModelSerializer):
    pokemon = PokemonSerializer()

    class Meta:
        model = PokemonCardDetails
        fields = ["pokemon_type", "hp", "retreat", "pokemon", "weakness_type"]
