import json
from django.core.management.base import BaseCommand
from cards.models import Language, Rarity, Type, TypeTranslation, Set, SetTranslation, Card, RarityTranslation

DATASET_PATH = "/home/acetone/12-WildCodeSchool/tcg-trader/backend/dataset/game-data.json"

class Command(BaseCommand):
    help = "Seed the database with Pokémon card data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Loading dataset...")

        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)

        languages = [{'code':'FR','name':'français'},{'code':'EN','name':'english'},{'code':'DE','name':'deutsch'},{'code':'ES','name':'español'},{'code':'IT','name':'italiano'}]
        sets = data["data"]["expansions"]
        rarities = data["data"]["rarities"]
        types = data["data"]["pokemonTypes"]
        cards = data["data"]["cards"]

        self.stdout.write(f"Found {len(rarities)} rarities.")
        self.stdout.write(f"Found {len(types)} types.")
        self.stdout.write(f"Found {len(sets)} sets.")
        self.stdout.write(f"Found {len(cards)} cards.")


        # First set up all languages
        for language in languages:
            language_obj, created = Language.objects.get_or_create(
                code=language["code"],
                defaults={"name": language["name"]}
            )
            if created:
                self.stdout.write(f"Added language: {language['name']} ({language['code']})")
            else:
                self.stdout.write(f"Language already exists: {language_obj}")
       
        # Then insert all rarities and their english translation
        for rarity in rarities:
            rarity_obj, created = Rarity.objects.get_or_create(
                code=rarity["id"],
            )

            RarityTranslation.objects.get_or_create(
                rarity=rarity_obj,
                language=Language.objects.get(code="EN"),
                name=rarity["name"]  # Assuming you have translations in the dataset
            )

        # Then insert all types and their english translation
        for type in types:
            type_obj, created = Type.objects.get_or_create(
                code=type["id"],
                image_url=f'/types/{type["id"].lower()}.webp'
            )

            TypeTranslation.objects.get_or_create(
                type=type_obj,
                language=Language.objects.get(code="EN"),
                name=type["id"]  # Assuming you have translations in the dataset
            )

        # Then insert all sets and their english translation
        for set in sets:
            set_obj, created = Set.objects.get_or_create(
                code=set["expansionId"],
            )
            print(set_obj, created)

            SetTranslation.objects.get_or_create(
                set=set_obj,
                language=Language.objects.get(code="EN"),
                name=set["name"]  # Assuming you have translations in the dataset
            )
