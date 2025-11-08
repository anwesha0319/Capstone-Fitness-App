from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class HealthData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='health_data')
    date = models.DateField()
    steps = models.IntegerField(default=0)
    calories_burned = models.FloatField(default=0.0)
    distance = models.FloatField(default=0.0, help_text="Distance in km")
    active_minutes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'health_data'
        ordering = ['-date']
        unique_together = ['user', 'date']
        indexes = [
            models.Index(fields=['user', 'date']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.date}"

class HeartRateData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='heart_rate_data')
    timestamp = models.DateTimeField()
    heart_rate = models.IntegerField(help_text="BPM")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'heart_rate_data'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.heart_rate} BPM"

class SleepData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sleep_data')
    date = models.DateField()
    sleep_duration = models.FloatField(help_text="Hours of sleep")
    sleep_quality = models.CharField(max_length=20, choices=[
        ('poor', 'Poor'),
        ('fair', 'Fair'),
        ('good', 'Good'),
        ('excellent', 'Excellent')
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sleep_data'
        ordering = ['-date']
        unique_together = ['user', 'date']

    def __str__(self):
        return f"{self.user.email} - {self.date}"

class WorkoutSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workouts')
    workout_type = models.CharField(max_length=50, choices=[
        ('running', 'Running'),
        ('cycling', 'Cycling'),
        ('walking', 'Walking'),
        ('gym', 'Gym'),
        ('yoga', 'Yoga'),
        ('swimming', 'Swimming'),
        ('other', 'Other')
    ])
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    duration = models.IntegerField(help_text="Duration in minutes")
    calories_burned = models.FloatField(default=0.0)
    distance = models.FloatField(null=True, blank=True, help_text="Distance in km")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'workout_sessions'
        ordering = ['-start_time']
        indexes = [
            models.Index(fields=['user', 'start_time']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.workout_type}"
