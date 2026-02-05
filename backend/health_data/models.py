from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Diet Model - Stores user's diet recommendations and tracking
class Diet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='diets')
    daily_calories = models.IntegerField()
    meal_plan = models.JSONField(default=dict)  # Stores breakfast, lunch, dinner
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'diet'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - Diet Plan"

# Workout Model - Stores workout programs and plans
class Workout(models.Model):
    INTENSITY_CHOICES = [
        ('low', 'Low'),
        ('moderate', 'Moderate'),
        ('high', 'High'),
    ]
    
    FEEDBACK_CHOICES = [
        ('easy', 'Too Easy'),
        ('just_right', 'Just Right'),
        ('difficult', 'Too Difficult'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workouts_plans')
    workout_name = models.CharField(max_length=100)
    workout_type = models.CharField(max_length=50)  # e.g., Cardio, Strength, Flexibility
    duration = models.IntegerField()  # in minutes or days for multi-day plans
    calories_burned = models.FloatField(default=0.0)
    intensity = models.CharField(max_length=20, choices=INTENSITY_CHOICES, default='moderate')
    date = models.DateField()
    description = models.TextField(blank=True)
    is_daily_plan = models.BooleanField(default=False)  # True for daily progressive plans
    plan_day_number = models.IntegerField(null=True, blank=True)  # Which day in progression
    user_feedback = models.CharField(max_length=20, choices=FEEDBACK_CHOICES, null=True, blank=True)
    feedback_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'workout'
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.email} - {self.workout_name}"

# Marathon Model
class Marathon(models.Model):
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('training', 'Training'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='marathons')
    marathon_name = models.CharField(max_length=100)
    distance = models.FloatField()  # in km
    target_date = models.DateField()
    target_time = models.TimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    location = models.CharField(max_length=200, blank=True)
    actual_time = models.TimeField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'marathon'
        ordering = ['-target_date']

    def __str__(self):
        return f"{self.user.email} - {self.marathon_name}"

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

class WaterIntake(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='water_intake')
    date = models.DateField()
    amount = models.FloatField(help_text="Water intake in liters")
    goal = models.FloatField(default=3.0, help_text="Daily water goal in liters")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'water_intake'
        ordering = ['-date']
        unique_together = ['user', 'date']
        indexes = [
            models.Index(fields=['user', 'date']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.date} - {self.amount}L"


class DailyNutritionLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_nutrition_logs')
    date = models.DateField()
    total_calories = models.FloatField(default=0)
    total_protein = models.FloatField(default=0)
    total_carbs = models.FloatField(default=0)
    total_fat = models.FloatField(default=0)
    is_locked = models.BooleanField(default=False)
    locked_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'daily_nutrition_log'
        ordering = ['-date']
        unique_together = ['user', 'date']
        indexes = [
            models.Index(fields=['user', 'date']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.date} - {self.total_calories} cal"
