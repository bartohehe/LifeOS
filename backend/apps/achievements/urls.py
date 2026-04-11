from django.urls import path
from .views import UserAchievementListView

urlpatterns = [
    path('', UserAchievementListView.as_view(), name='user-achievements'),
]
