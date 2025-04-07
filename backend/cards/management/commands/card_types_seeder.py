import json
from django.core.management.base import BaseCommand
from cards.models import (
    Language,
    CardType,
    CardTypeTranslation,
)

DATASET_PATH = "/app/dataset/card-types.json"


class Command(BaseCommand):
    help = "Seed the database with card types data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Loading card types dataset...")

        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            types = json.load(f)

        self.stdout.write(f"Found {len(types)} types.")

        lang_en = Language.objects.get(code="EN")
        lang_fr = Language.objects.get(code="FR")

        # Then insert all types and their english translation
        for type in types:
            type_obj, type_created = CardType.objects.get_or_create(code=type["code"])
            if type_created:
                self.stdout.write(self.style.SUCCESS(f"✔ Created Card Type: {type_obj}"))
            else:
                self.stdout.write(self.style.WARNING(f"⚠ Card Type already exists: {type_obj}"))

            en_translation_obj, en_translation_created = CardTypeTranslation.objects.get_or_create(
                card_type=type_obj,
                language=lang_en,
                name=type["name-en"],  # Assuming you have translations in the dataset
            )

            if en_translation_created:
                self.stdout.write(
                    self.style.SUCCESS(f"   └─ Created English translation: {en_translation_obj}")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"   └─ English translation already exists for: {type_obj}")
                )

            fr_translation_obj, fr_translation_created = CardTypeTranslation.objects.get_or_create(
                card_type=type_obj,
                language=lang_fr,
                name=type["name-fr"],  # Assuming you have translations in the dataset
            )

            if fr_translation_created:
                self.stdout.write(
                    self.style.SUCCESS(f"   └─ Created French translation: {fr_translation_obj}")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"   └─ French translation already exists for: {type_obj}")
                )
