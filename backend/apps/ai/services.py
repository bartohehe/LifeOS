from django.contrib.auth import get_user_model

User = get_user_model()


def analyze_day(user: User, date=None) -> dict:
    """
    Analyze user's day using AI.

    Returns dict with analysis results.
    Full implementation will be added in AI sprint.
    """
    raise NotImplementedError("AI integration not yet implemented. Coming in AI sprint.")


def plan_day(user: User, date=None) -> dict:
    """
    Generate a personalized day plan using AI.

    Returns dict with planned activities.
    Full implementation will be added in AI sprint.
    """
    raise NotImplementedError("AI integration not yet implemented. Coming in AI sprint.")
