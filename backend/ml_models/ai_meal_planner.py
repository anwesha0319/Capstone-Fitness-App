import os
import json
from google import genai

# Initialize Gemini API
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def generate_meal_image_prompt(meal_name, meal_type):
    """Generate a prompt for meal image that matches the UI style"""
    return f"""Create a beautiful, appetizing photo of {meal_name} for a {meal_type} meal.

Style requirements:
- Soft pastel colors with dreamy lighting
- Frosted glass plate or bowl with subtle transparency
- Holographic light reflections
- Airy, luminous atmosphere
- Soft purple and lavender ambient glow
- Professional food photography
- Top-down or 45-degree angle
- Clean, minimalist presentation
- Soft shadows with purple tint
- Slightly magical, futuristic feel

The image should match a soft pastel glassmorphism AI assistant interface with:
- Lavender, sky blue, and soft pink color palette
- Dreamy gradient background
- Friendly, futuristic aesthetic
- Soft, bright, slightly holographic appearance

Make the food look fresh, healthy, and appealing."""


def generate_meal_plan(calories, diet_type, allergies, goal, days, feedback=None):
    """
    Generate a personalized meal plan using Google Gemini AI
    
    Args:
        calories (int): Daily calorie target
        diet_type (str): Dietary preference (vegetarian, vegan, keto, etc.)
        allergies (str): Comma-separated list of allergies
        goal (str): Fitness goal (lose weight, gain muscle, maintain, etc.)
        days (int): Number of days to generate (7, 30, 90, 180, 365)
        feedback (dict): User's recent eating patterns for smart recommendations
    
    Returns:
        dict: Meal plan structured by day with breakfast, lunch, dinner
    """
    feedback_text = ""

    if feedback:
        feedback_text = f"""
        User recent intake summary:
        Calories eaten: {feedback['calories']}
        Protein eaten: {feedback['protein']}g
        Carbs eaten: {feedback['carbs']}g
        Fat eaten: {feedback['fat']}g

        Adjust the new meal plan to correct imbalances and match user preferences.
        """

    prompt = f"""
    Create a {days}-day healthy meal plan.

    Daily calories target: {calories}
    Diet type: {diet_type}
    Allergies: {allergies}
    Goal: {goal}

    {feedback_text}

    Each day must include Breakfast, Lunch, Dinner.
    Each meal must contain multiple food items with:
    - name (string)
    - calories (number)
    - protein (number in grams)
    - carbs (number in grams)
    - fat (number in grams)

    Return ONLY valid JSON structured by day number as keys (1, 2, 3, etc.).
    Example format:
    {{
        "1": {{
            "breakfast": [
                {{"name": "Oatmeal", "calories": 150, "protein": 5, "carbs": 27, "fat": 3}},
                {{"name": "Banana", "calories": 105, "protein": 1, "carbs": 27, "fat": 0}}
            ],
            "lunch": [...],
            "dinner": [...]
        }},
        "2": {{...}}
    }}
    
    IMPORTANT: Return ONLY the JSON object, no additional text or explanation.
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp',
            contents=prompt
        )
        
        # Extract JSON from response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith('```json'):
            response_text = response_text[7:]
        if response_text.startswith('```'):
            response_text = response_text[3:]
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        
        response_text = response_text.strip()
        
        return json.loads(response_text)
    except Exception as e:
        print(f"Error generating meal plan with Gemini: {e}")
        # Fallback to simple plan if API fails
        return generate_fallback_plan(calories, diet_type, days)


def generate_meal_image(meal_name, meal_type):
    """
    Generate an image for a meal using Gemini AI
    
    Args:
        meal_name (str): Name of the meal
        meal_type (str): Type of meal (breakfast, lunch, dinner)
    
    Returns:
        str: Base64 encoded image or None if generation fails
    """
    try:
        prompt = generate_meal_image_prompt(meal_name, meal_type)
        
        response = client.models.generate_images(
            model='imagen-3.0-generate-001',
            prompt=prompt,
            number_of_images=1,
            aspect_ratio='1:1',
            safety_filter_level='block_some',
            person_generation='allow_adult'
        )
        
        if response and response.generated_images:
            # Return the first generated image as base64
            return response.generated_images[0].image.data
        
        return None
    except Exception as e:
        print(f"Error generating meal image with Gemini: {e}")
        return None


def generate_fallback_plan(calories, diet_type, days):
    """Simple fallback meal plan if API fails"""
    if diet_type in ['vegetarian', 'vegan']:
        breakfast = [
            {"name": "Oatmeal with Berries", "calories": 250, "protein": 8, "carbs": 45, "fat": 5},
            {"name": "Banana", "calories": 105, "protein": 1, "carbs": 27, "fat": 0}
        ]
        lunch = [
            {"name": "Quinoa Salad", "calories": 350, "protein": 12, "carbs": 55, "fat": 10},
            {"name": "Mixed Vegetables", "calories": 80, "protein": 3, "carbs": 15, "fat": 1}
        ]
        dinner = [
            {"name": "Tofu Stir Fry", "calories": 300, "protein": 18, "carbs": 25, "fat": 15},
            {"name": "Brown Rice", "calories": 215, "protein": 5, "carbs": 45, "fat": 2}
        ]
    else:
        breakfast = [
            {"name": "Scrambled Eggs", "calories": 200, "protein": 14, "carbs": 2, "fat": 15},
            {"name": "Whole Wheat Toast", "calories": 140, "protein": 6, "carbs": 26, "fat": 2}
        ]
        lunch = [
            {"name": "Grilled Chicken Breast", "calories": 280, "protein": 53, "carbs": 0, "fat": 6},
            {"name": "Sweet Potato", "calories": 180, "protein": 4, "carbs": 41, "fat": 0}
        ]
        dinner = [
            {"name": "Baked Salmon", "calories": 350, "protein": 39, "carbs": 0, "fat": 20},
            {"name": "Quinoa", "calories": 220, "protein": 8, "carbs": 39, "fat": 4}
        ]
    
    plan = {}
    for day in range(1, days + 1):
        plan[str(day)] = {
            "breakfast": breakfast,
            "lunch": lunch,
            "dinner": dinner
        }
    
    return plan
