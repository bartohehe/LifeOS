from .models import Player, PlayerStats


XP_PER_LEVEL = 1000


def get_or_create_player(user):
    """Get existing player or create a new one with default stats."""
    player, created = Player.objects.get_or_create(user=user)
    if created:
        PlayerStats.objects.create(player=player)
    return player


def award_xp(player: Player, xp_amount: int) -> Player:
    """Award XP to a player and handle level-up logic. Full impl in sprint."""
    player.total_xp += xp_amount
    player.current_xp += xp_amount
    player.save()
    return player


def calculate_level(total_xp: int) -> int:
    """Calculate player level from total XP. Full impl in sprint."""
    return max(1, total_xp // XP_PER_LEVEL + 1)
