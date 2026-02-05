from django.urls import path
from .views import (
    HealthDataListCreateView,
    HeartRateDataListCreateView,
    SleepDataListCreateView,
    BulkHealthDataCreateView,
    AnalyticsView,
    DietListCreateView,
    DietDetailView,
    MarathonListCreateView,
    MarathonDetailView,
    WorkoutListCreateView,
    WorkoutDetailView,
    save_water_intake,
    get_water_intake,
)

urlpatterns = [
    # Health Data
    path('health-data/', HealthDataListCreateView.as_view(), name='health-data'),
    path('heart-rate/', HeartRateDataListCreateView.as_view(), name='heart-rate'),
    path('sleep/', SleepDataListCreateView.as_view(), name='sleep'),
    path('sync/', BulkHealthDataCreateView.as_view(), name='bulk-sync'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    
    # Water Intake
    path('water-intake/', save_water_intake, name='save-water-intake'),
    path('water-intake/get/', get_water_intake, name='get-water-intake'),
    
    # Diet
    path('diet/', DietListCreateView.as_view(), name='diet-list'),
    path('diet/<int:pk>/', DietDetailView.as_view(), name='diet-detail'),
    
    # Workout Plans
    path('workout/', WorkoutListCreateView.as_view(), name='workout-list'),
    path('workout/<int:pk>/', WorkoutDetailView.as_view(), name='workout-detail'),
    
    # Marathon
    path('marathon/', MarathonListCreateView.as_view(), name='marathon-list'),
    path('marathon/<int:pk>/', MarathonDetailView.as_view(), name='marathon-detail'),
]