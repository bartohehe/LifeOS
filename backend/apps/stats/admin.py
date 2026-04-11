from django.contrib import admin
from .models import Player, PlayerStats


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('user', 'level', 'total_xp', 'current_xp')
    search_fields = ('user__username',)


@admin.register(PlayerStats)
class PlayerStatsAdmin(admin.ModelAdmin):
    list_display = ('player', 'strength', 'intelligence', 'vitality', 'wisdom', 'discipline', 'charisma')
