from django.contrib import admin
from cards.models import (
    Pokemon,
    Language,
    PokemonTranslation,
    Set,
    SetTranslation,
    PokemonType,
    PokemonTypeTranslation,
    Rarity,
    RarityTranslation,
    Card,
    CardImage,
    CardNameTranslation,
    CardType,
)

# Register your models here.
admin.site.register(Language)
admin.site.register(Pokemon)
admin.site.register(PokemonTranslation)
admin.site.register(Set)
admin.site.register(SetTranslation)
admin.site.register(PokemonType)
admin.site.register(PokemonTypeTranslation)
admin.site.register(Rarity)
admin.site.register(RarityTranslation)
admin.site.register(Card)
admin.site.register(CardNameTranslation)
admin.site.register(CardType)
admin.site.register(CardImage)
