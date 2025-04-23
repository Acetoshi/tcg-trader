import json
from django.core.management.base import BaseCommand
from cards.models import (
    Language,
    Color,
    ColorTranslation,
)

DATASET_PATH = "/app/dataset/colors.json"


class Command(BaseCommand):
    help = "Seed the database with Pokémon colors data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Loading pokemon colors dataset...")

        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            colors = json.load(f)

        self.stdout.write(f"Found {len(colors)} colors.")

        lang_en = Language.objects.get(code="EN")
        lang_fr = Language.objects.get(code="FR")

        # Then insert all colors and their english translation
        for color in colors:
            color_obj, color_created = Color.objects.get_or_create(
                code=color["id"], image_url=f"/images/colors/{color['id'].lower()}.webp"
            )
            if color_created:
                self.stdout.write(self.style.SUCCESS(f"✔ Created Color: {color_obj}"))
            else:
                self.stdout.write(self.style.WARNING(f"⚠ Color already exists: {color_obj}"))

            translation_obj, translation_created = ColorTranslation.objects.get_or_create(
                color=color_obj,
                language=lang_en,
                name=color["name-en"],  # Assuming you have translations in the dataset
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

            translation_obj, translation_created = ColorTranslation.objects.get_or_create(
                color=color_obj,
                language=lang_fr,
                name=color["name-fr"],  # Assuming you have translations in the dataset
            )

            if translation_created:
                self.stdout.write(
                    self.style.SUCCESS(f"   └─ Created French translation: {translation_obj}")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f"   └─ French translation already exists for: {translation_obj}"
                    )
                )
