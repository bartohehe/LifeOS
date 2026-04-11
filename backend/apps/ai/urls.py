from django.urls import path
from .views import AnalyzeDayView, PlanDayView

urlpatterns = [
    path('analyze/', AnalyzeDayView.as_view(), name='ai-analyze'),
    path('plan/', PlanDayView.as_view(), name='ai-plan'),
]
