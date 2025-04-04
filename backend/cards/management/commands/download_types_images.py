import os
import requests
from django.core.management.base import BaseCommand

types = [
    "colorless",
    "grass",
    "fire",
    "water",
    "lightning",
    "psychic",
    "fighting",
    "darkness",
    "metal",
    "dragon",
    "fairy",
]
# directory where images will be saved
SAVE_DIR = "/app/static/images/types"

# Ensure the directory exists
os.makedirs(SAVE_DIR, exist_ok=True)

# Base URL for the Pokémon card images
BASE_URL = "{image_source_url}/icons/{type}.png"
IMAGE_SOURCE_URL = os.getenv("IMAGE_SOURCE_URL")


class Command(BaseCommand):
    help = "Download Pokémon card images"

    def handle(self, *args, **kwargs):

        for type in types:

            url = BASE_URL.format(image_source_url=IMAGE_SOURCE_URL, type=type)
            filename = os.path.join(SAVE_DIR, f"{type}.webp")

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
