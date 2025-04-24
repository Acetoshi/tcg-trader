import json
from django.core.management.base import BaseCommand
from modules.cards.models import (
    Language,
    Rarity,
    RarityTranslation,
)

DATASET_PATH = "/app/dataset/rarities.json"


class Command(BaseCommand):
    help = "Seed the database with Rarity data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Loading rarities dataset...")

        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            rarities = json.load(f)

        self.stdout.write(f"Found {len(rarities)} rarities.")

        # First get the English language object
        lang_en = Language.objects.get(code="EN")
        lang_fr = Language.objects.get(code="FR")

        # Then insert all rarities and their english translation
        for rarity in rarities:
            rarity_obj, created = Rarity.objects.get_or_create(
                code=rarity["id"], image_url=f'/images/rarities/{rarity["filename"]}.webp'
            )

            RarityTranslation.objects.get_or_create(
                rarity=rarity_obj,
                language=lang_en,
                name=rarity["name-en"],  # Assuming you have translations in the dataset
            )

            RarityTranslation.objects.get_or_create(
                rarity=rarity_obj,
                language=lang_fr,
                name=rarity["name-fr"],  # Assuming you have translations in the dataset
            )
        self.stdout.write(f"Added {len(rarities)} rarities with English translations.")
