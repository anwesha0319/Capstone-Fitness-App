import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fitness_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Check if test user already exists
email = 'test@fitwell.com'
if User.objects.filter(email=email).exists():
    print(f"✅ Test user already exists: {email}")
    user = User.objects.get(email=email)
    print(f"   Username: {user.username}")
    print(f"   Name: {user.first_name} {user.last_name}")
else:
    # Create test user
    user = User.objects.create_user(
        email=email,
        username='testuser',
        password='Test@1234',
        first_name='Test',
        last_name='User',
        date_of_birth='1995-01-01',
        height=175.0,
        weight=70.0,
        gender='male',
        fitness_goal='maintain'
    )
    print(f"✅ Created test user successfully!")
    print(f"   Email: {email}")
    print(f"   Password: Test@1234")
    print(f"   Username: {user.username}")
    print(f"   Name: {user.first_name} {user.last_name}")

print("\n📱 You can now login with:")
print(f"   Email: {email}")
print(f"   Password: Test@1234")
