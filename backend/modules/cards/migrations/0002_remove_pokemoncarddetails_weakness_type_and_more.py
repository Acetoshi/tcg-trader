# Generated by Django 5.1.7 on 2025-04-07 20:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cards", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="pokemoncarddetails",
            name="weakness_type",
        ),
        migrations.AddField(
            model_name="pokemoncarddetails",
            name="weak_to",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="weak_to",
                to="cards.color",
            ),
        ),
    ]
