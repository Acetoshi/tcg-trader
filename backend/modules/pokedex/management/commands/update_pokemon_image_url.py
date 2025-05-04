import json
from django.core.management.base import BaseCommand
from modules.cards.models import Pokemon

EN_DATASET_PATH = "/app/dataset/pokedex_data_en.json"

COMMON_URL = "/images/pokemon/"


class Command(BaseCommand):
    help = "Seed the database with Pokédex data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Loading pokédex dataset...")

        with open(EN_DATASET_PATH, "r", encoding="utf-8") as f:
            pokemons = json.load(f)

        # Then insert all pokemon and their english translation
        for pokemon in pokemons:
            new_image_url = f"{COMMON_URL}{pokemon['slug']}.webp"

            pokemon_obj = Pokemon.objects.get(pokedex_number=pokemon["id"])

            pokemon_obj.image_url = new_image_url
            pokemon_obj.save()
            self.stdout.write(
                self.style.SUCCESS(f"✅ Updated: {pokemon['id']} - {pokemon['name']}")
            )
