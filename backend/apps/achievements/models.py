from django.conf import settings
from django.db import models
from apps.core.models import BaseModel


class Achievement(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='🏆')
    xp_reward = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'achievements'
        ordering = ['name']

    def __str__(self):
        return self.name


class UserAchievement(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='achievements',
    )
    achievement = models.ForeignKey(
        Achievement,
        on_delete=models.CASCADE,
        related_name='user_achievements',
    )
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_achievements'
        unique_together = ('user', 'achievement')
        ordering = ['-earned_at']

    def __str__(self):
        return f'{self.user.username} — {self.achievement.name}'
