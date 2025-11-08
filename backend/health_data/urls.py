from django.urls import path
from .views import (
    HealthDataListCreateView,
    HeartRateDataListCreateView,
    SleepDataListCreateView,
    WorkoutSessionListCreateView,
    BulkHealthDataCreateView,
    AnalyticsView
)

urlpatterns = [
    path('health-data/', HealthDataListCreateView.as_view(), name='health-data'),
    path('heart-rate/', HeartRateDataListCreateView.as_view(), name='heart-rate'),
    path('sleep/', SleepDataListCreateView.as_view(), name='sleep'),
    path('workouts/', WorkoutSessionListCreateView.as_view(), name='workouts'),
    path('sync/', BulkHealthDataCreateView.as_view(), name='bulk-sync'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
]