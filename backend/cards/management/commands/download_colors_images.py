import os
import requests
import json
from django.core.management.base import BaseCommand


# directory where images will be saved
SAVE_DIR = "/app/static/images/colors"

# Ensure the directory exists
os.makedirs(SAVE_DIR, exist_ok=True)

# Base URL for the Pokémon card images
BASE_URL = "{image_source_url}/icons/{color}.png"
IMAGE_SOURCE_URL = os.getenv("IMAGE_SOURCE_URL")

DATASET_PATH = "/app/dataset/colors.json"


class Command(BaseCommand):
    help = "Download Pokémon color images"

    def handle(self, *args, **kwargs):

        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            colors = json.load(f)

        for color in colors:

            print(color["id"])

            url = BASE_URL.format(image_source_url=IMAGE_SOURCE_URL, color=color["id"])
            filename = os.path.join(SAVE_DIR, f"{color['id']}.webp")

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
