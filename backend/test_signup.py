import requests
import json

# Test signup endpoint
url = "http://192.168.29.52:8000/api/auth/signup/"

data = {
    "email": "testuser999@example.com",
    "username": "testuser999",
    "password": "TestPass123!",
    "password2": "TestPass123!",
    "first_name": "Test",
    "last_name": "User"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
