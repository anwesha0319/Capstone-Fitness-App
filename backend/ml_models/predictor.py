import numpy as np
from datetime import datetime, timedelta

class FitnessPredictor:
    """
    Simple ML predictor for fitness metrics.
    In production, replace with trained scikit-learn or TensorFlow models.
    """
    
    @staticmethod
    def predict_calories_burned(steps, weight_kg, age, gender):
        """
        Predict calories burned based on steps and user profile.
        Formula: Basic metabolic calculation with activity factor.
        """
        # Gender factor (male burns ~10% more)
        gender_factor = 1.1 if gender == 'male' else 1.0
        
        # Age factor (younger = higher metabolism)
        age_factor = 1.0 - (age - 20) * 0.005 if age > 20 else 1.0
        
        # Basic calculation: ~0.04 calories per step per kg
        base_calories = steps * 0.04 * weight_kg / 70  # Normalized to 70kg
        
        # Apply factors
        calories = base_calories * gender_factor * age_factor
        
        return round(calories, 2)
    
    @staticmethod
    def predict_goal_achievement(current_steps, goal_steps, days_left):
        """
        Predict likelihood of achieving step goal.
        Returns probability between 0 and 1.
        """
        if days_left <= 0:
            return 1.0 if current_steps >= goal_steps else 0.0
        
        required_daily_steps = (goal_steps - current_steps) / days_left
        
        # Assume average person can do 10k steps/day comfortably
        max_comfortable_steps = 10000
        
        if required_daily_steps <= max_comfortable_steps:
            probability = 0.9 - (required_daily_steps / max_comfortable_steps) * 0.3
        else:
            probability = 0.6 * (max_comfortable_steps / required_daily_steps)
        
        return round(max(0.0, min(1.0, probability)), 2)
    
    @staticmethod
    def recommend_workout_intensity(avg_heart_rate, age, fitness_goal):
        """
        Recommend workout intensity based on heart rate and goals.
        """
        max_hr = 220 - age
        
        if fitness_goal == 'lose_weight':
            target_zone = (0.60 * max_hr, 0.70 * max_hr)
            intensity = 'moderate'
        elif fitness_goal == 'gain_muscle':
            target_zone = (0.70 * max_hr, 0.85 * max_hr)
            intensity = 'high'
        elif fitness_goal == 'improve_endurance':
            target_zone = (0.65 * max_hr, 0.75 * max_hr)
            intensity = 'moderate'
        else:
            target_zone = (0.50 * max_hr, 0.70 * max_hr)
            intensity = 'low-moderate'
        
        return {
            'recommended_intensity': intensity,
            'target_heart_rate_zone': target_zone,
            'current_hr': avg_heart_rate,
            'max_hr': max_hr,
            'in_target_zone': target_zone[0] <= avg_heart_rate <= target_zone[1]
        }
    
    @staticmethod
    def analyze_sleep_quality(sleep_hours, consistency_score):
        """
        Analyze sleep quality and provide recommendations.
        consistency_score: 0-1, based on variance in sleep times
        """
        optimal_sleep = 8.0
        sleep_deficit = optimal_sleep - sleep_hours
        
        if sleep_hours >= 7 and sleep_hours <= 9 and consistency_score > 0.7:
            quality = 'excellent'
            recommendation = 'Great job! Maintain your sleep schedule.'
        elif sleep_hours >= 6 and consistency_score > 0.6:
            quality = 'good'
            recommendation = 'Try to get closer to 8 hours of sleep consistently.'
        elif sleep_hours >= 5:
            quality = 'fair'
            recommendation = 'Aim for at least 7 hours of sleep. Consider a consistent bedtime.'
        else:
            quality = 'poor'
            recommendation = 'Your sleep is significantly impacting your fitness. Prioritize rest.'
        
        return {
            'quality': quality,
            'hours': sleep_hours,
            'optimal_hours': optimal_sleep,
            'deficit_hours': round(sleep_deficit, 1),
            'consistency_score': consistency_score,
            'recommendation': recommendation
        }
    
    @staticmethod
    def predict_weekly_trend(daily_data):
        """
        Predict trend for next week based on historical data.
        daily_data: list of dicts with 'steps', 'calories', etc.
        """
        if len(daily_data) < 3:
            return {'trend': 'insufficient_data'}
        
        steps = [d['steps'] for d in daily_data]
        avg_steps = np.mean(steps)
        
        # Simple linear regression
        x = np.arange(len(steps))
        slope = np.polyfit(x, steps, 1)[0]
        
        # Predict next 7 days
        future_x = np.arange(len(steps), len(steps) + 7)
        predicted_steps = [avg_steps + slope * i for i in future_x]
        
        trend = 'increasing' if slope > 100 else 'decreasing' if slope < -100 else 'stable'
        
        return {
            'trend': trend,
            'current_avg': round(avg_steps, 0),
            'predicted_avg': round(np.mean(predicted_steps), 0),
            'slope': round(slope, 2)
        }