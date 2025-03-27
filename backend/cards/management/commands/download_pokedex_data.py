import requests
import json
from django.core.management.base import BaseCommand

#TODO : this doesn't work because the site thinks i'm a bot, detection seems to be triggered by user-agent
#curl -s "https://www.pokemon.com/api/1/us/kalos/kalos" -o dataset/kalos_data.json

URL = "https://www.pokemon.com/api/1/us/kalos/kalos"
OUTPUT_FILE = "/app/dataset/pokedex_data_en.json"

class Command(BaseCommand):
    help = "Download Pokémon data from the official API"

    def handle(self, *args, **kwargs):
        self.stdout.write("Fetching Pokémon data...")

        try:
            response = requests.get(URL)
            response.raise_for_status()  # Raise an error for bad responses

            data = response.json()  # Parse JSON response
            with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
                json.dump(data, file, indent=4)

            self.stdout.write(self.style.SUCCESS(f"Data successfully downloaded and saved to {OUTPUT_FILE}"))

        except requests.exceptions.RequestException as e:
            self.stderr.write(self.style.ERROR(f"Error fetching data: {e}"))