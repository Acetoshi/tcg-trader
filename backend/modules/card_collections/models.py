from django.db import models
from modules.cards.models import Card, Language
from django.contrib.auth import get_user_model

User = get_user_model()


class UserCardCollection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    card = models.ForeignKey(Card, related_name="user_card_collection", on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE, null=True, blank=True)
    quantity_owned = models.PositiveIntegerField(default=0)
    quantity_for_trade = models.PositiveIntegerField(default=0)
    desired_quantity = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("user", "card", "language")

    def __str__(self):
        return f"{self.user} owns {self.quantity_owned} of {self.card}"
