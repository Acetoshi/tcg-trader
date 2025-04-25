from django.core.management.base import BaseCommand
from modules.trades.models import TradeStatus  # Replace with your actual Status model

# Sample status data array
STATUS_DATA = [
    {"code": "Pending"},
    {"code": "Accepted"},
    {"code": "Completed"},
    {"code": "Cancelled"},
]


class Command(BaseCommand):
    help = "Seed the database with Status data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding statuses...")

        for status in STATUS_DATA:
            status_obj, created = TradeStatus.objects.get_or_create(
                code=status["code"],
            )
            if created:
                self.stdout.write(f"Created status: {status['code']}")
            else:
                self.stdout.write(f"Status already exists: {status['code']}")
