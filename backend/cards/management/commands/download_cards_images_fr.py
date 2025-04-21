import os
import json
import requests
from PIL import Image
from io import BytesIO
from django.core.management.base import BaseCommand

# Set metadata for all sets
SETS = [
    {"code": "A1", "datasetFile": "dataset/cards_A1_FR.json", "name-fr": "Puissance Génétique"},
    {
        "code": "A1a",
        "datasetFile": "dataset/cards_A1a_FR.json",
    },
    {
        "code": "PROMO",
        "datasetFile": "dataset/cards_PROMO-A_FR.json",
    },
    {
        "code": "A2",
        "datasetFile": "dataset/cards_A2_FR.json",
    },
    {
        "code": "A2a",
        "datasetFile": "dataset/cards_A2a_FR.json",
    },
    {
        "code": "A2b",
        "datasetFile": "dataset/cards_A2b_FR.json",
    },
]

# Where to save images
BASE_SAVE_DIR = "/app/static/images/cards/fr"


class Command(BaseCommand):
    help = "Download Pokémon card images per set from dataset files"

    def handle(self, *args, **kwargs):
        os.makedirs(BASE_SAVE_DIR, exist_ok=True)

        for set_info in SETS:
            code = set_info["code"]
            dataset_path = set_info["datasetFile"]
            set_save_dir = os.path.join(BASE_SAVE_DIR, code)
            os.makedirs(set_save_dir, exist_ok=True)

            try:
                with open(dataset_path, "r", encoding="utf-8") as f:
                    cards = json.load(f)
            except FileNotFoundError:
                self.stdout.write(self.style.ERROR(f"Dataset not found for {code}: {dataset_path}"))
                continue

            for card in cards:
                image_url = card["image"]
                card_number = card["card_number"]

                # Use padded number
                padded_number = card_number.zfill(3)
                filename = os.path.join(set_save_dir, f"{code}-{padded_number}.webp")

                if os.path.exists(filename):
                    self.stdout.write(self.style.WARNING(f"Skipping {filename}, already exists."))
                    continue

                self.stdout.write(f"Downloading {image_url} as {filename}...")

                try:
                    response = requests.get(image_url)
                    response.raise_for_status()

                    img = Image.open(BytesIO(response.content)).convert("RGB")
                    img.save(filename, "webp", quality=85)
                    self.stdout.write(self.style.SUCCESS(f"✅ Saved: {filename}"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"❌ Error saving {filename}: {str(e)}"))

        self.stdout.write(self.style.SUCCESS("\n🎉 All sets processed. Done!"))
