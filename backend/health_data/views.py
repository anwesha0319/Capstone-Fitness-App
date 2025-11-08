from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Sum, Count
from datetime import datetime, timedelta
from .models import HealthData, HeartRateData, SleepData, WorkoutSession
from .serializers import (
    HealthDataSerializer, HeartRateDataSerializer,
    SleepDataSerializer, WorkoutSessionSerializer,
    HealthDataBulkSerializer
)

class HealthDataListCreateView(generics.ListCreateAPIView):
    serializer_class = HealthDataSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = HealthData.objects.filter(user=self.request.user)
        days = self.request.query_params.get('days', None)
        if days:
            start_date = datetime.now().date() - timedelta(days=int(days))
            queryset = queryset.filter(date__gte=start_date)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class HeartRateDataListCreateView(generics.ListCreateAPIView):
    serializer_class = HeartRateDataSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return HeartRateData.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SleepDataListCreateView(generics.ListCreateAPIView):
    serializer_class = SleepDataSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SleepData.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WorkoutSessionListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkoutSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WorkoutSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BulkHealthDataCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = HealthDataBulkSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        created_counts = {}

        # Create health data
        if 'health_data' in data:
            health_objs = [
                HealthData(user=request.user, **item)
                for item in data['health_data']
            ]
            HealthData.objects.bulk_create(
                health_objs,
                update_conflicts=True,
                update_fields=['steps', 'calories_burned', 'distance', 'active_minutes'],
                unique_fields=['user', 'date']
            )
            created_counts['health_data'] = len(health_objs)

        # Create heart rate data
        if 'heart_rate_data' in data:
            hr_objs = [
                HeartRateData(user=request.user, **item)
                for item in data['heart_rate_data']
            ]
            HeartRateData.objects.bulk_create(hr_objs, ignore_conflicts=True)
            created_counts['heart_rate_data'] = len(hr_objs)

        # Create sleep data
        if 'sleep_data' in data:
            sleep_objs = [
                SleepData(user=request.user, **item)
                for item in data['sleep_data']
            ]
            SleepData.objects.bulk_create(
                sleep_objs,
                update_conflicts=True,
                update_fields=['sleep_duration', 'sleep_quality'],
                unique_fields=['user', 'date']
            )
            created_counts['sleep_data'] = len(sleep_objs)

        # Create workout sessions
        if 'workout_sessions' in data:
            workout_objs = [
                WorkoutSession(user=request.user, **item)
                for item in data['workout_sessions']
            ]
            WorkoutSession.objects.bulk_create(workout_objs)
            created_counts['workout_sessions'] = len(workout_objs)

        return Response({
            'message': 'Health data synced successfully',
            'created': created_counts
        }, status=status.HTTP_201_CREATED)

class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = int(request.query_params.get('days', 7))
        start_date = datetime.now().date() - timedelta(days=days)

        health_data = HealthData.objects.filter(
            user=request.user,
            date__gte=start_date
        )

        analytics = {
            'period': f'Last {days} days',
            'total_steps': health_data.aggregate(Sum('steps'))['steps__sum'] or 0,
            'total_calories': health_data.aggregate(Sum('calories_burned'))['calories_burned__sum'] or 0,
            'total_distance': health_data.aggregate(Sum('distance'))['distance__sum'] or 0,
            'avg_steps': health_data.aggregate(Avg('steps'))['steps__avg'] or 0,
            'avg_calories': health_data.aggregate(Avg('calories_burned'))['calories_burned__avg'] or 0,
            'workout_count': WorkoutSession.objects.filter(
                user=request.user,
                start_time__date__gte=start_date
            ).count(),
            'daily_data': list(health_data.values('date', 'steps', 'calories_burned', 'distance'))
        }

        # Heart rate stats
        hr_data = HeartRateData.objects.filter(
            user=request.user,
            timestamp__date__gte=start_date
        )
        analytics['avg_heart_rate'] = hr_data.aggregate(Avg('heart_rate'))['heart_rate__avg'] or 0

        # Sleep stats
        sleep_data = SleepData.objects.filter(
            user=request.user,
            date__gte=start_date
        )
        analytics['avg_sleep_hours'] = sleep_data.aggregate(Avg('sleep_duration'))['sleep_duration__avg'] or 0

        return Response(analytics)