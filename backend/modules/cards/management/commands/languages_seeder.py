from django.core.management.base import BaseCommand
from modules.cards.models import (
    Language,
)


class Command(BaseCommand):
    help = "Seed the database with Pokémon card data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Loading languages...")

        languages = [
            {"code": "FR", "name": "français"},
            {"code": "EN", "name": "english"},
            {"code": "DE", "name": "deutsch"},
            {"code": "ES", "name": "español"},
            {"code": "IT", "name": "italiano"},
        ]

        # set up all languages
        try:
            for language in languages:
                language_obj, created = Language.objects.get_or_create(
                    code=language["code"], defaults={"name": language["name"]}
                )
                if created:
                    self.stdout.write(f"Added language: {language['name']} ({language['code']})")
                else:
                    self.stdout.write(f"Language already exists: {language_obj}")

            self.stdout.write("All languages successfully added.")
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error creating languages: {e}"))
            return
