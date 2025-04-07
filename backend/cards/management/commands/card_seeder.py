import json
from django.core.management.base import BaseCommand
from cards.models import (
    Language,
    Rarity,
    PokemonTypeTranslation,
    Set,
    Card,
    CardImage,
    Illustrator,
    PokemonCardDetails,
    PokemonCardDetailsTranslation,
    PokemonTranslation,
    CardNameTranslation,
)

DATASET_PATH = "/app/dataset/game-data-en.json"


class Command(BaseCommand):
    help = "Seed the database with Pokémon card data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Loading cards dataset...")

        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            cards = json.load(f)

        self.stdout.write(f"Found {len(cards)} cards.")

        lang_en = Language.objects.get(code="EN")

        # Then insert all cards and their english translation
        for card in cards:

            self.stdout.write(f"\n📄 Processing card: {card['name']}")

            # Create or update the card object
            illustrator, illustrator_created = Illustrator.objects.get_or_create(
                name=card["illustrator"]
            )
            set_obj = Set.objects.get(code__iexact=card["setId"])
            rarity_obj = Rarity.objects.get(
                raritytranslation__name__iexact=card["rarity"],
                raritytranslation__language__code="EN",
            )

            card_obj, card_created = Card.objects.get_or_create(
                set=set_obj,
                number=int(card["number"]),
                rarity=rarity_obj,
                illustrator=illustrator,
            )

            if card_created:
                self.stdout.write(self.style.SUCCESS(f"✔ Created Card : {card_obj}"))
            else:
                self.stdout.write(self.style.WARNING(f"⚠ Card already exists : {card_obj}"))
            # Create or update the card image
            en_image_obj, en_image_created = CardImage.objects.update_or_create(
                card=card_obj,
                language=lang_en,
                url=f"/images/cards/en/{card['setId']}/{card['setId']}-{int(card['number']):03d}.webp",
            )
            if en_image_created:
                self.stdout.write(
                    self.style.SUCCESS(f"   └─ Created English Image: {en_image_obj}")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"   └─ English Image already exists for: {en_image_obj}")
                )
            CardNameTranslation.objects.update_or_create(
                card=card_obj, language=lang_en, name=card["name"]
            )

            if card["type"] == "Pokemon":

                # find pokemon in pokedex
                try:
                    pokemon_trans_obj = PokemonTranslation.objects.filter(
                        name__icontains=card["name"].replace(" ex", "")
                    ).first()
                    pokemon_obj = pokemon_trans_obj.pokemon
                    print(f"pokemon was found : {pokemon_obj}")
                except (
                    Exception
                ):  # if a pokemon has a composed name, try and search for every keyword in its name
                    try:
                        pokemon_trans_obj = PokemonTranslation.objects.filter(
                            name__icontains=card["name"].split()[1]
                        ).first()
                        pokemon_obj = pokemon_trans_obj.pokemon
                    except Exception:
                        try:
                            pokemon_trans_obj = PokemonTranslation.objects.filter(
                                name__icontains=card["name"].split()[2]
                            ).first()
                            pokemon_obj = pokemon_trans_obj.pokemon
                        except Exception:
                            print(f'couldnt find {print(card["name"])} in db')

                # find pokemon type in db
                pokemon_type_trans_obj = PokemonTypeTranslation.objects.get(
                    name__icontains=card["color"]
                )
                pokemon_type_obj = pokemon_type_trans_obj.pokemon_type

                # find pokemon weakness type in db
                try:
                    pokemon_weakness_type_trans_obj = PokemonTypeTranslation.objects.get(
                        name__icontains=card["weakness"]
                    )
                    pokemon_weakness_type_obj = pokemon_weakness_type_trans_obj.pokemon_type
                except PokemonTypeTranslation.DoesNotExist:
                    pokemon_weakness_type_obj = None  # or set a default value

                pokemon_card_details_obj, created = PokemonCardDetails.objects.update_or_create(
                    card=card_obj,
                    hp=card["hp"],
                    pokemon=pokemon_obj,
                    weakness_type=pokemon_weakness_type_obj,
                    retreat=card["retreat"],
                    pokemon_type=pokemon_type_obj,
                )
                print(f'Finished adding Card details for {card["name"]}')

                PokemonCardDetailsTranslation.objects.get_or_create(
                    pokemon_card_details=pokemon_card_details_obj,
                    language=lang_en,
                    description=card["text"],
                )

        #     SetTranslation.objects.get_or_create(
        #         set=set_obj,
        #         language=lang_en,
        #         name=set["name"]  # Assuming you have translations in the dataset
        #     )
