from rest_framework import serializers
from .models import Player, PlayerStats


class PlayerStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerStats
        fields = ('strength', 'intelligence', 'vitality', 'wisdom', 'discipline', 'charisma')


class PlayerSerializer(serializers.ModelSerializer):
    stats = PlayerStatsSerializer(read_only=True)

    class Meta:
        model = Player
        fields = ('id', 'level', 'total_xp', 'current_xp', 'xp_to_next_level', 'stats', 'created_at', 'updated_at')
        read_only_fields = ('id', 'level', 'total_xp', 'current_xp', 'xp_to_next_level', 'created_at', 'updated_at')
