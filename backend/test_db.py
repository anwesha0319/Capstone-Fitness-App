import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fitness_backend.settings')
django.setup()

from django.db import connection

print("=" * 50)
print("PostgreSQL Database Configuration")
print("=" * 50)
print(f"Database Name: {connection.settings_dict['NAME']}")
print(f"User: {connection.settings_dict['USER']}")
print(f"Host: {connection.settings_dict['HOST']}")
print(f"Port: {connection.settings_dict['PORT']}")
print("=" * 50)

# Test connection
with connection.cursor() as cursor:
    cursor.execute("SELECT version();")
    version = cursor.fetchone()[0]
    print(f"PostgreSQL Version: {version[:50]}...")
    
    cursor.execute("SELECT COUNT(*) FROM users;")
    user_count = cursor.fetchone()[0]
    print(f"Total Users in Database: {user_count}")
    
print("=" * 50)
print("✅ PostgreSQL Connection: SUCCESSFUL")
print("=" * 50)
