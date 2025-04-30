import uuid
from django.db import models
from django.contrib.auth import get_user_model
from modules.card_collections.models import UserCardCollection

User = get_user_model()


class TradeStatus(models.Model):
    code = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.code


class TradeTransaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    initiator = models.ForeignKey(User, related_name="initiator", on_delete=models.CASCADE)
    partner = models.ForeignKey(User, related_name="partner", on_delete=models.CASCADE)
    offered = models.ForeignKey(
        UserCardCollection, related_name="offered_card", on_delete=models.CASCADE
    )
    requested = models.ForeignKey(
        UserCardCollection, related_name="requested_card", on_delete=models.CASCADE
    )
    status = models.ForeignKey(TradeStatus, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
