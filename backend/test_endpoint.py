import requests

# Test if the server is accessible
url = "http://192.168.29.52:8000/api/auth/signup/"

print("Testing server connectivity...")
print(f"URL: {url}")
print("-" * 50)

try:
    # Try a simple GET request first
    response = requests.get("http://192.168.29.52:8000/")
    print(f"✅ Server is reachable!")
    print(f"Status: {response.status_code}")
except Exception as e:
    print(f"❌ Cannot reach server: {e}")
    print("\nPossible issues:")
    print("1. Server is not running")
    print("2. Firewall is blocking the connection")
    print("3. Device is on a different network")
