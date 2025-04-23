from django.db import models
from django.contrib.auth import get_user_model
from card_collections.models import UserCardCollection

User = get_user_model()


class TradeStatus(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class TradeTransaction(models.Model):
    id = models.UUIDField(primary_key=True, default=models.UUIDField, editable=False)
    initiator = models.ForeignKey(User, on_delete=models.CASCADE)
    offered = models.ForeignKey(
        UserCardCollection, related_name="offered_card", on_delete=models.CASCADE
    )
    requested = models.ForeignKey(
        UserCardCollection, related_name="requested_card", on_delete=models.CASCADE
    )
    status = models.ForeignKey(TradeStatus, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
