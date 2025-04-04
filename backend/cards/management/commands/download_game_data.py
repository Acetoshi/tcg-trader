import os
import requests
import json
from django.core.management.base import BaseCommand

# Directory where images will be saved
BASE_SAVE_DIR = "/app/dataset"

# Ensure the directory exists
os.makedirs(BASE_SAVE_DIR, exist_ok=True)

GAME_DATA_SOURCE_URL = os.getenv("GAME_DATA_SOURCE_URL")


class Command(BaseCommand):
    help = "Download TGCP Game Data"

    def handle(self, *args, **kwargs):
        try:
            # Fetch the data from the source URL
            response = requests.get(GAME_DATA_SOURCE_URL)

            # Check if the request was successful
            response.raise_for_status()

            # Parse the response JSON
            game_data = response.json()

            # Define the file path where the data will be saved
            file_path = os.path.join(BASE_SAVE_DIR, "game-data-en.json")

            # Write the data to the JSON file
            with open(file_path, "w", encoding="utf-8") as json_file:
                json.dump(game_data, json_file, ensure_ascii=False, indent=4)

            self.stdout.write(self.style.SUCCESS(f"Game data downloaded and saved to {file_path}"))

        except requests.exceptions.RequestException as e:
            self.stdout.write(self.style.ERROR(f"Error downloading data: {e}"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An unexpected error occurred: {e}"))
