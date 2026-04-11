from django.conf import settings
from django.db import models
from apps.core.models import BaseModel


class Activity(BaseModel):
    CATEGORY_CHOICES = [
        ('fitness', 'Fitness'),
        ('learning', 'Learning'),
        ('work', 'Work'),
        ('social', 'Social'),
        ('health', 'Health'),
        ('creative', 'Creative'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='activities',
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    duration_minutes = models.PositiveIntegerField(default=0)
    xp_gained = models.PositiveIntegerField(default=0)
    logged_at = models.DateTimeField()

    class Meta:
        db_table = 'activities'
        ordering = ['-logged_at']

    def __str__(self):
        return f'{self.user.username} — {self.title} ({self.logged_at.date()})'
