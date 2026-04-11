from .models import CustomUser


def create_user(username: str, email: str, password: str) -> CustomUser:
    """Create and return a new user. Stub — logic will be expanded in a sprint."""
    return CustomUser.objects.create_user(username=username, email=email, password=password)
