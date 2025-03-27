from django.db import models

# Language Model
class Language(models.Model):
    code = models.CharField(max_length=5, unique=True)  # ISO Code
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.code

# Pokemon list (ie the official pokedex)
class Pokemon(models.Model):
    pokedex_number = models.IntegerField(unique=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"Pokémon #{self.pokedex_number}"

# Pokemon list localisation
class PokemonTranslation(models.Model):
    pokemon = models.ForeignKey(Pokemon, on_delete=models.CASCADE, related_name="translations")
    language = models.ForeignKey("Language", on_delete=models.CASCADE) 
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=False)

    class Meta:
        unique_together = ("pokemon", "language")

    def __str__(self):
        return f"{self.name} ({self.language.code})"



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
class PokemonType(models.Model):
    code = models.CharField(max_length=100)
    image_url = models.URLField()

    def __str__(self):
        return self.code


# Type Translation
class PokemonTypeTranslation(models.Model):
    pokemon_type = models.ForeignKey(PokemonType, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    class Meta:
        unique_together = ('pokemon_type', 'language')

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
class CardNameTranslation(models.Model):
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
    type = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.card.reference}"
    
class PokemonCardDetails(models.Model):
    pokemon = models.ForeignKey(Pokemon, on_delete=models.CASCADE, related_name='pokemon')
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='pokemon_card_details')
    hp = models.IntegerField()
    weakness_type = models.ForeignKey(PokemonType, on_delete=models.CASCADE, null=True, blank=True,related_name='weakness_type')
    retreat = models.CharField(max_length=100)
    pokemon_type = models.ForeignKey(PokemonType, on_delete=models.CASCADE, related_name='pokemon_type')

    def __str__(self):
        return f"PokemonCardDetails for {self.pokemon.name} with {self.card.name}"
    
class PokemonCardDetailsTranslation(models.Model):
    pokemon_card_details = models.ForeignKey('PokemonCardDetails', on_delete=models.CASCADE, related_name='translations')
    language = models.ForeignKey('Language', on_delete=models.CASCADE)
    description = models.CharField(max_length=255,null=True)  # Assuming `varchar` with a max length of 255, adjust if needed.

    def __str__(self):
        return f"Translation for {self.pokemon_card_details.pokemon.name} ({self.language.code})"