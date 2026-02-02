from django.db import models
from django.conf import settings

# UserBodyProfile removed - using User table directly (has age, gender, height, weight)

class MealPlan(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    meal_type = models.CharField(max_length=20)


class MealItem(models.Model):
    meal = models.ForeignKey(MealPlan, on_delete=models.CASCADE, related_name="items")
    food_name = models.CharField(max_length=100)
    calories = models.FloatField()
    protein = models.FloatField()
    carbs = models.FloatField()
    fat = models.FloatField()
    image_url = models.TextField(null=True, blank=True)  # Store base64 or URL

class MealItemTracking(models.Model):
    meal_item = models.ForeignKey(MealItem, on_delete=models.CASCADE)
    status = models.CharField(max_length=20)  # eaten / skipped
    quantity_ratio = models.FloatField()  # 1.0 full, 0.5 half
    timestamp = models.DateTimeField(auto_now_add=True)
