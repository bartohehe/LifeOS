from .models import Activity


def log_activity(user, title: str, category: str, duration_minutes: int, logged_at) -> Activity:
    """Create an activity log entry. XP calculation will be added in a sprint."""
    return Activity.objects.create(
        user=user,
        title=title,
        category=category,
        duration_minutes=duration_minutes,
        logged_at=logged_at,
    )
