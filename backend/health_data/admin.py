from django.contrib import admin
from .models import (
    HealthData, HeartRateData, SleepData, WorkoutSession,
    Diet, Marathon, Workout, WaterIntake
)

@admin.register(HealthData)
class HealthDataAdmin(admin.ModelAdmin):
    list_display = ['user', 'date', 'steps', 'calories_burned', 'distance']
    search_fields = ['user__email', 'date']
    list_filter = ['date', 'user']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(HeartRateData)
class HeartRateDataAdmin(admin.ModelAdmin):
    list_display = ['user', 'timestamp', 'heart_rate']
    search_fields = ['user__email']
    list_filter = ['timestamp', 'user']
    readonly_fields = ['created_at']

@admin.register(SleepData)
class SleepDataAdmin(admin.ModelAdmin):
    list_display = ['user', 'date', 'sleep_duration', 'sleep_quality']
    search_fields = ['user__email', 'date']
    list_filter = ['date', 'sleep_quality', 'user']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(WorkoutSession)
class WorkoutSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'workout_type', 'start_time', 'duration', 'calories_burned']
    search_fields = ['user__email', 'workout_type']
    list_filter = ['workout_type', 'start_time', 'user']
    readonly_fields = ['created_at']

@admin.register(Diet)
class DietAdmin(admin.ModelAdmin):
    list_display = ['user', 'daily_calories', 'created_at']
    search_fields = ['user__email']
    list_filter = ['created_at', 'user']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Marathon)
class MarathonAdmin(admin.ModelAdmin):
    list_display = ['user', 'marathon_name', 'distance', 'target_date', 'status']
    search_fields = ['user__email', 'marathon_name', 'location']
    list_filter = ['status', 'target_date', 'user']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['user', 'workout_name', 'workout_type', 'duration', 'intensity', 'date']
    search_fields = ['user__email', 'workout_name', 'workout_type']
    list_filter = ['intensity', 'date', 'user']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(WaterIntake)
class WaterIntakeAdmin(admin.ModelAdmin):
    list_display = ['user', 'date', 'amount', 'goal']
    search_fields = ['user__email']
    list_filter = ['date', 'user']
    readonly_fields = ['created_at', 'updated_at']
