# Generated by Django 5.1.7 on 2025-05-04 19:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_alter_customuser_username"),
    ]

    operations = [
        migrations.RenameField(
            model_name="customuser",
            old_name="avatarUrl",
            new_name="avatar_url",
        ),
    ]
