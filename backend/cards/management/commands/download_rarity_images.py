import os
import requests
from django.core.management.base import BaseCommand

rarities = [
    {"url": "Common", "filename": "common"},
    {"url": "Uncommon", "filename": "uncommon"},
    {"url": "Rare", "filename": "rare"},
    {"url": "DoubleRare", "filename": "double-rare"},
    {"url": "ArtRare", "filename": "art-rare"},
    {"url": "SuperRare", "filename": "super-rare"},
    {"url": "ImmersiveRare", "filename": "immersive-rare"},
    {"url": "CrownRare", "filename": "crown-rare"},
    {"url": "SpecialArtRare", "filename": "special-art-rare"},
]

# directory where images will be saved
SAVE_DIR = "/app/static/images/rarities"

# Ensure the directory exists
os.makedirs(SAVE_DIR, exist_ok=True)

# Base URL for the Pokémon card images
BASE_URL = "{image_source_url}/icons/{rarity}.png"
IMAGE_SOURCE_URL = os.getenv("IMAGE_SOURCE_URL")


class Command(BaseCommand):
    help = "Download Pokémon card images"

    def handle(self, *args, **kwargs):

        for rarity in rarities:

            url = BASE_URL.format(image_source_url=IMAGE_SOURCE_URL, rarity=rarity["url"])
            filename = os.path.join(SAVE_DIR, f"{rarity['filename']}.webp")

            if os.path.exists(filename):
                self.stdout.write(self.style.WARNING(f"Skipping {filename}, already exists."))
                continue

            self.stdout.write(f"Downloading {url}...")

            response = requests.get(url, stream=True)
            if response.status_code == 200:
                with open(filename, "wb") as f:
                    for chunk in response.iter_content(1024):
                        f.write(chunk)
                self.stdout.write(self.style.SUCCESS(f"Saved: {filename}"))
            else:
                self.stdout.write(self.style.ERROR(f"Failed to download: {url}"))

        self.stdout.write(self.style.SUCCESS("Download complete."))
