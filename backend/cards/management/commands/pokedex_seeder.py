import json
from django.core.management.base import BaseCommand
from cards.models import Language, Pokemon, PokemonTranslation

EN_DATASET_PATH = "/app/dataset/pokedex_data_en.json"
FR_DATASET_PATH = "/app/dataset/pokedex_data_fr.json"


class Command(BaseCommand):
    help = "Seed the database with Pokédex data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Loading dataset...")

        with open(EN_DATASET_PATH, "r", encoding="utf-8") as f:
            pokemons = json.load(f)

        languages = [
            {"code": "FR", "name": "français"},
            {"code": "EN", "name": "english"},
            {"code": "DE", "name": "deutsch"},
            {"code": "ES", "name": "español"},
            {"code": "IT", "name": "italiano"},
        ]

        # First set up all languages, in the
        for language in languages:
            language_obj, created = Language.objects.get_or_create(
                code=language["code"], defaults={"name": language["name"]}
            )
            if created:
                self.stdout.write(f"Added language: {language['name']} ({language['code']})")
            else:
                self.stdout.write(f"Language already exists: {language_obj}")

        # Then insert all pokemon and their english translation
        for pokemon in pokemons:
            pokemon_obj, created = Pokemon.objects.get_or_create(
                pokedex_number=pokemon["id"], image_url=pokemon["ThumbnailImage"]
            )

            PokemonTranslation.objects.get_or_create(
                pokemon=pokemon_obj,
                language=Language.objects.get(code="EN"),
                name=pokemon["name"],
                slug=pokemon["slug"],
            )
        print("Added pokemon EN")

        # Then insert all pokemon and their French translation

        with open(FR_DATASET_PATH, "r", encoding="utf-8") as f:
            pokemons = json.load(f)

        lang_fr = Language.objects.get(code="FR")

        for pokemon in pokemons:
            PokemonTranslation.objects.get_or_create(
                pokemon=Pokemon.objects.get(pokedex_number=pokemon["id"]),
                language=lang_fr,
                name=pokemon["name"],
                slug=pokemon["slug"],
            )
        print("Added pokemon FR")
