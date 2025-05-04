import os
import json
import requests
from PIL import Image
from io import BytesIO
from django.core.management.base import BaseCommand

EN_DATASET_PATH = "/app/dataset/pokedex_data_en.json"
BASE_SAVE_DIR = "/app/static/images/pokemon"


class Command(BaseCommand):
    help = "Download Pokémon images from dataset"

    def handle(self, *args, **kwargs):
        os.makedirs(BASE_SAVE_DIR, exist_ok=True)

        # Load English dataset
        try:
            with open(EN_DATASET_PATH, "r", encoding="utf-8") as f:
                pokemons = json.load(f)
        except FileNotFoundError:
            self.stderr.write(f"❌ Dataset not found: {EN_DATASET_PATH}")
            return
        except json.JSONDecodeError as e:
            self.stderr.write(f"❌ Failed to parse JSON: {e}")
            return

        for pokemon in pokemons:
            try:
                slug = pokemon["slug"]
                image_url = pokemon["ThumbnailImage"]
                filename = os.path.join(BASE_SAVE_DIR, f"{slug}.webp")

                if os.path.exists(filename):
                    self.stdout.write(
                        self.style.WARNING(f"⏩ Skipping {filename}, already exists.")
                    )
                    continue

                self.stdout.write(f"⬇️ Downloading {image_url} as {filename}...")

                response = requests.get(image_url)
                response.raise_for_status()

                img = Image.open(BytesIO(response.content)).convert("RGBA")
                img.save(filename, "webp", quality=85)
                self.stdout.write(self.style.SUCCESS(f"✅ Saved: {filename}"))

            except KeyError as e:
                self.stderr.write(f"⚠️ Missing key {e} in record: {pokemon}")
            except Exception as e:
                self.stderr.write(f"❌ Error processing {slug}: {e}")

        self.stdout.write(self.style.SUCCESS("\n🎉 All Pokémon processed. Done!"))
