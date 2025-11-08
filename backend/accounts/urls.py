from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import SignupView, ProfileView, CustomTokenObtainPairView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
]