import os
import requests
from django.core.management.base import BaseCommand

sets = [
    {"code": "A1", "count": 286},
    {"code": "A1a", "count": 86},
    {"code": "A2", "count": 207},
    {"code": "A2a", "count": 96},
]

# Directory where images will be saved
BASE_SAVE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../static/images/cards/en/'))

# Ensure the directory exists
os.makedirs(BASE_SAVE_DIR, exist_ok=True)

# Base URL for the Pokémon card images
BASE_URL = "https://static.dotgg.gg/pokepocket/card/{code}-{number:03d}.webp"


class Command(BaseCommand):
    help = "Download Pokémon card images"

    def handle(self, *args, **kwargs):


        for set in sets:
            code = set["code"]
            set_save_dir = os.path.join(BASE_SAVE_DIR, code)
            # Ensure the directory exists
            os.makedirs(set_save_dir, exist_ok=True)

            start = 1   # First card number
            end = set["count"]   # Last card number (adjust as needed)

            for number in range(start, end + 1):
                url = BASE_URL.format(code=code,number=number)
                filename = os.path.join(set_save_dir, f"{code}-{number:03d}.webp")

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