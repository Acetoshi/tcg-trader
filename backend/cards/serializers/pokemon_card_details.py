from rest_framework import serializers
from cards.models import PokemonCardDetails


class PokemonCardDetailsSerializer(serializers.ModelSerializer):
    pokedexNumber = serializers.IntegerField(source="pokemon.pokedex_number", read_only=True)
    type = serializers.CharField(source="color.code", read_only=True)
    weakness = serializers.CharField(source="weak_to.code", read_only=True)

    class Meta:
        model = PokemonCardDetails
        fields = ["pokedexNumber", "hp", "type", "retreat", "weakness"]
        # fields = '__all__'
