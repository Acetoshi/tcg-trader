from django.db import models

# Language Model
class Language(models.Model):
    code = models.CharField(max_length=5, unique=True)  # ISO Code
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.code


# Card Set Model
class Set(models.Model):
    code = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.code


# Set Translation
class SetTranslation(models.Model):
    set = models.ForeignKey(Set, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()

    class Meta:
        unique_together = ('set', 'language')

    def __str__(self):
        return f"{self.name} ({self.language.code})"


# Pokémon Type Model
class Type(models.Model):
    code = models.CharField(max_length=100)
    image_url = models.URLField()

    def __str__(self):
        return self.code


# Type Translation
class TypeTranslation(models.Model):
    type = models.ForeignKey(Type, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    class Meta:
        unique_together = ('type', 'language')

    def __str__(self):
        return f"{self.name} ({self.language.code})"


# Rarity Model
class Rarity(models.Model):
    code = models.CharField(max_length=5)
    image_url = models.URLField()

    def __str__(self):
        return self.code


# Rarity Translation
class RarityTranslation(models.Model):
    rarity = models.ForeignKey(Rarity, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    class Meta:
        unique_together = ('rarity', 'language')

    def __str__(self):
        return f"{self.name} ({self.language.code})"

# Illustrators
class Illustrator(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

# Card Model
class Card(models.Model):
    reference = models.CharField(max_length=100)
    number = models.IntegerField()
    rarity = models.ForeignKey(Rarity, on_delete=models.CASCADE)
    hp = models.IntegerField()
    weakness = models.CharField(max_length=255)
    retreat = models.CharField(max_length=255)
    illustrator = models.ForeignKey(Illustrator, on_delete=models.CASCADE)
    set = models.ForeignKey(Set, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.reference} - {self.set.name}"


# Card Image
class CardImage(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='image')
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.card.reference} ({self.language.code})"


# Card Translation
class CardTranslation(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    class Meta:
        unique_together = ('card', 'language')

    def __str__(self):
        return f"{self.name} ({self.language.code})"


# Card Type Relationship
class CardType(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE)
    type = models.ForeignKey(Type, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.card.reference} - {self.type.name}"