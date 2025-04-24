import json
from django.core.management.base import BaseCommand
from modules.cards.models import (
    Language,
    Set,
    SetTranslation,
)

DATASET_PATH = "/app/dataset/sets.json"


class Command(BaseCommand):
    help = "Seed the database with card sets data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Loading sets dataset...")

        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            sets = json.load(f)

        self.stdout.write(f"Found {len(sets)} sets.")

        lang_en = Language.objects.get(code="EN")
        lang_fr = Language.objects.get(code="FR")

        # Then insert all sets and their english translation
        for set in sets:
            set_obj, created = Set.objects.get_or_create(
                code=set["code"],
            )

            SetTranslation.objects.update_or_create(
                set=set_obj,
                language=lang_en,
                name=set["name-en"],  # Assuming you have translations in the dataset
            )
            self.stdout.write(self.style.SUCCESS(f"added set {set['name-en']}"))

            SetTranslation.objects.update_or_create(
                set=set_obj,
                language=lang_fr,
                name=set["name-fr"],  # Assuming you have translations in the dataset
            )
            self.stdout.write(self.style.SUCCESS(f"added set {set['name-en']}"))
        print("Added Sets")
