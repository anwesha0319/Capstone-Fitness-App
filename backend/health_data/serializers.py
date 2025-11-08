from rest_framework import serializers
from .models import HealthData, HeartRateData, SleepData, WorkoutSession

class HealthDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthData
        fields = ['id', 'date', 'steps', 'calories_burned', 'distance', 
                  'active_minutes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class HeartRateDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeartRateData
        fields = ['id', 'timestamp', 'heart_rate', 'created_at']
        read_only_fields = ['id', 'created_at']

class SleepDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SleepData
        fields = ['id', 'date', 'sleep_duration', 'sleep_quality', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class WorkoutSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutSession
        fields = ['id', 'workout_type', 'start_time', 'end_time', 'duration',
                  'calories_burned', 'distance', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']

class HealthDataBulkSerializer(serializers.Serializer):
    health_data = HealthDataSerializer(many=True, required=False)
    heart_rate_data = HeartRateDataSerializer(many=True, required=False)
    sleep_data = SleepDataSerializer(many=True, required=False)
    workout_sessions = WorkoutSessionSerializer(many=True, required=False)