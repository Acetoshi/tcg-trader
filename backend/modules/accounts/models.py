from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class CustomUser(AbstractUser):
    # Add custom fields
    tcgp_id = models.TextField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    avatar_url = models.URLField(null=True, blank=True)

    # Override the default primary key to use UUIDs
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
