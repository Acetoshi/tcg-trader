import json
from django.core.management.base import BaseCommand
from django.core.exceptions import ObjectDoesNotExist
from cards.models import (
    Language,
    Rarity,
    RarityTranslation,
    PokemonType,
    PokemonTypeTranslation,
    Set,
    SetTranslation,
    Card,
    CardImage,
    Illustrator,
    PokemonCardDetails,
    PokemonCardDetailsTranslation,
    PokemonTranslation,
    CardNameTranslation,
)

DATASET_PATH = "/app/dataset/game-data.json"


class Command(BaseCommand):
    help = "Seed the database with Pokémon card data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Loading dataset...")

        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)

        languages = [
            {"code": "FR", "name": "français"},
            {"code": "EN", "name": "english"},
            {"code": "DE", "name": "deutsch"},
            {"code": "ES", "name": "español"},
            {"code": "IT", "name": "italiano"},
        ]
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
                code=language["code"], defaults={"name": language["name"]}
            )
            if created:
                self.stdout.write(f"Added language: {language['name']} ({language['code']})")
            else:
                self.stdout.write(f"Language already exists: {language_obj}")

        lang_en = Language.objects.get(code="EN")

        # Then insert all rarities and their english translation
        for rarity in rarities:
            rarity_obj, created = Rarity.objects.get_or_create(
                code=rarity["id"],
            )

            RarityTranslation.objects.get_or_create(
                rarity=rarity_obj,
                language=lang_en,
                name=rarity["name"],  # Assuming you have translations in the dataset
            )
        print("Added EN rarities")

        # Then insert all types and their english translation
        for type in types:
            type_obj, created = PokemonType.objects.get_or_create(
                code=type["id"], image_url=f'/types/{type["id"].lower()}.webp'
            )

            PokemonTypeTranslation.objects.get_or_create(
                pokemon_type=type_obj,
                language=lang_en,
                name=type["id"],  # Assuming you have translations in the dataset
            )
        print("Added types")

        # Then insert all sets and their english translation
        for set in sets:
            set_obj, created = Set.objects.get_or_create(
                code=set["expansionId"],
            )

            SetTranslation.objects.get_or_create(
                set=set_obj,
                language=lang_en,
                name=set["name"],  # Assuming you have translations in the dataset
            )
        print("Added Sets")

        # Then insert all cards and their english translation
        # print(cards[0])

        for card in cards:
            if card["pokemon"]:

                print(f'Inserting {card["pokemon"]["name"]} ...')

                # Get or create the Illustrator first
                illustrator, created = Illustrator.objects.get_or_create(
                    name=card["illustratorNames"][
                        0
                    ]  # Assuming card contains the illustrator's name
                )

                card_obj, created = Card.objects.get_or_create(
                    set=Set.objects.get(code=card["expansionCollectionNumbers"][0]["expansionId"]),
                    number=card["collectionNumber"],
                    rarity=Rarity.objects.get(code=card["rarity"]),
                    illustrator=illustrator,
                )

                CardImage.objects.update_or_create(
                    card=card_obj,
                    language=lang_en,
                    url=f"/images/cards/en/{card['expansionCollectionNumbers'][0]['expansionId']}/{card['expansionCollectionNumbers'][0]['expansionId']}-{card['collectionNumber']:03d}.webp",
                )
                print("Added CardImage")

                CardNameTranslation.objects.update_or_create(
                    card=card_obj, language=lang_en, name=card["pokemon"]["name"]
                )

                # find pokemon in pokedex
                try:
                    pokemon_trans_obj = PokemonTranslation.objects.filter(
                        name__icontains=card["pokemon"]["name"].replace(" ex", "")
                    ).first()
                    pokemon_obj = pokemon_trans_obj.pokemon
                    print(f"pokemon was found : {pokemon_obj}")
                except (
                    ObjectDoesNotExist
                ):  # if a pokemon has a composed name, try and search for every keyword in its name
                    try:
                        pokemon_trans_obj = PokemonTranslation.objects.filter(
                            name__icontains=card["pokemon"]["name"].split()[1]
                        ).first()
                        pokemon_obj = pokemon_trans_obj.pokemon
                    except ObjectDoesNotExist:
                        try:
                            pokemon_trans_obj = PokemonTranslation.objects.filter(
                                name__icontains=card["pokemon"]["name"].split()[2]
                            ).first()
                            pokemon_obj = pokemon_trans_obj.pokemon
                        except ObjectDoesNotExist:
                            print(f'couldnt find {print(card["pokemon"]["name"])} in db')

                # find pokemon type in db
                pokemon_type_trans_obj = PokemonTypeTranslation.objects.get(
                    name__icontains=card["pokemon"]["pokemonTypes"][0]
                )
                pokemon_type_obj = pokemon_type_trans_obj.pokemon_type

                # find pokemon weakness type in db
                try:
                    pokemon_weakness_type_trans_obj = PokemonTypeTranslation.objects.get(
                        name__icontains=card["pokemon"]["weaknessType"]
                    )
                    pokemon_weakness_type_obj = pokemon_weakness_type_trans_obj.pokemon_type
                except PokemonTypeTranslation.DoesNotExist:
                    pokemon_weakness_type_obj = None  # or set a default value

                pokemon_card_details_obj, created = PokemonCardDetails.objects.update_or_create(
                    card=card_obj,
                    hp=card["pokemon"]["hp"],
                    pokemon=pokemon_obj,
                    weakness_type=pokemon_weakness_type_obj,
                    retreat=card["pokemon"]["retreatAmount"],
                    pokemon_type=pokemon_type_obj,
                )
                print(f'Finished adding Card details for {card["pokemon"]["name"]}')

                PokemonCardDetailsTranslation.objects.get_or_create(
                    pokemon_card_details=pokemon_card_details_obj,
                    language=lang_en,
                    description=card["flavorText"],
                )

        #     SetTranslation.objects.get_or_create(
        #         set=set_obj,
        #         language=lang_en,
        #         name=set["name"]  # Assuming you have translations in the dataset
        #     )
