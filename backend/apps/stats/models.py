from django.conf import settings
from django.db import models
from apps.core.models import BaseModel


class Player(BaseModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='player',
    )
    level = models.PositiveIntegerField(default=1)
    total_xp = models.PositiveIntegerField(default=0)
    current_xp = models.PositiveIntegerField(default=0)
    xp_to_next_level = models.PositiveIntegerField(default=1000)

    class Meta:
        db_table = 'players'

    def __str__(self):
        return f'{self.user.username} — Level {self.level}'


class PlayerStats(BaseModel):
    STAT_CHOICES = [
        ('strength', 'Strength'),
        ('intelligence', 'Intelligence'),
        ('vitality', 'Vitality'),
        ('wisdom', 'Wisdom'),
        ('discipline', 'Discipline'),
        ('charisma', 'Charisma'),
    ]

    player = models.OneToOneField(
        Player,
        on_delete=models.CASCADE,
        related_name='stats',
    )
    strength = models.PositiveIntegerField(default=10)
    intelligence = models.PositiveIntegerField(default=10)
    vitality = models.PositiveIntegerField(default=10)
    wisdom = models.PositiveIntegerField(default=10)
    discipline = models.PositiveIntegerField(default=10)
    charisma = models.PositiveIntegerField(default=10)

    class Meta:
        db_table = 'player_stats'

    def __str__(self):
        return f'Stats for {self.player.user.username}'
