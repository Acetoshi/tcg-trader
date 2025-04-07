import json
from django.core.management.base import BaseCommand
from cards.models import (
    Language,
    PokemonType,
    PokemonTypeTranslation,
)

DATASET_PATH = "/app/dataset/pokemon-types.json"


class Command(BaseCommand):
    help = "Seed the database with Pokémon types data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Loading pokemon types dataset...")

        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            types = json.load(f)

        self.stdout.write(f"Found {len(types)} types.")

        lang_en = Language.objects.get(code="EN")

        # Then insert all types and their english translation
        for type in types:
            type_obj, type_created = PokemonType.objects.get_or_create(
                code=type["id"], image_url=f'/types/{type["id"].lower()}.webp'
            )
            if type_created:
                self.stdout.write(self.style.SUCCESS(f"✔ Created PokémonType: {type_obj}"))
            else:
                self.stdout.write(self.style.WARNING(f"⚠ PokémonType already exists: {type_obj}"))

            translation_obj, translation_created = PokemonTypeTranslation.objects.get_or_create(
                pokemon_type=type_obj,
                language=lang_en,
                name=type["name-en"],  # Assuming you have translations in the dataset
            )

            if translation_created:
                self.stdout.write(
                    self.style.SUCCESS(f"   └─ Created English translation: {translation_obj}")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f"   └─ English translation already exists for: {translation_obj}"
                    )
                )
