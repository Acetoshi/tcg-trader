import json
import os
from django.core.management.base import BaseCommand
from cards.models import Card, CardNameTranslation, CardImage, Language, Set


# Update this to include all sets you want to process
DATASETS = [
    {"setCode": "A1", "datasetFile": "dataset/cards_A1_FR.json"},
    {"setCode": "A1a", "datasetFile": "dataset/cards_A1a_FR.json"},
    {"setCode": "A2", "datasetFile": "dataset/cards_A2_FR.json"},
    {"setCode": "A2a", "datasetFile": "dataset/cards_A2a_FR.json"},
    {"setCode": "A2b", "datasetFile": "dataset/cards_A2b_FR.json"},
    {"setCode": "PROMO", "datasetFile": "dataset/cards_PROMO-A_FR.json"},
]

IMAGE_BASE_PATH = "/images/cards/fr/"


class Command(BaseCommand):
    help = "Seed French card names and images"

    def handle(self, *args, **kwargs):
        lang_fr = Language.objects.get(code="FR")

        for dataset in DATASETS:
            set_code = dataset["setCode"]
            dataset_path = dataset["datasetFile"]

            if not os.path.exists(dataset_path):
                self.stdout.write(self.style.ERROR(f"Dataset not found: {dataset_path}"))
                continue

            self.stdout.write(f"\n📁 Loading dataset: {dataset_path}")

            with open(dataset_path, "r", encoding="utf-8") as f:
                cards = json.load(f)

            set_obj = Set.objects.get(code=set_code)

            for card in cards:
                number = int(
                    card["card_number"]
                )  # get only the first part of number (before slash)
                card_name = card["name"]
                image_filename = f"{set_code}-{number:03d}.webp"
                image_url = os.path.join(IMAGE_BASE_PATH, set_code, image_filename)

                try:
                    card_obj = Card.objects.get(set=set_obj, number=number)

                    CardNameTranslation.objects.update_or_create(
                        card=card_obj,
                        language=lang_fr,
                        defaults={"name": card_name},
                    )

                    CardImage.objects.update_or_create(
                        card=card_obj,
                        language=lang_fr,
                        defaults={"url": image_url},
                    )

                    self.stdout.write(
                        self.style.SUCCESS(f"✔ Updated: {card_name} ({set_code}-{number:03d})")
                    )

                except Card.DoesNotExist:
                    self.stdout.write(
                        self.style.ERROR(f"❌ Card not found in DB: {set_code}-{number:03d}")
                    )

        self.stdout.write(self.style.SUCCESS("\n✅ Finished seeding French names and images."))
