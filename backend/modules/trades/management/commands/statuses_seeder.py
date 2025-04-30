from django.core.management.base import BaseCommand
from modules.trades.models import TradeStatus  # Replace with your actual Status model

# Sample status data array
# This data needs to be in sync with the union type in frontend trade service
STATUS_DATA = [
    {"code": "Pending"},  # the offer was just created by the initiator
    {"code": "Accepted"},  # the offer was accepted by the partner
    {"code": "Completed"},  # the trade was marked as completed by both parties
    {"code": "Cancelled"},  # the trade was canceled by the initiator
    {"code": "Refused"},  # the trade was refused by the partner
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
