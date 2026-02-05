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
    Create a {days}-day healthy meal plan with VARIETY - each day should have DIFFERENT meals.

    Daily calories target: {calories}
    Diet type: {diet_type}
    Allergies: {allergies if allergies else 'None'}
    Goal: {goal}

    {feedback_text}

    CRITICAL REQUIREMENTS:
    1. Each day MUST have DIFFERENT breakfast, lunch, and dinner
    2. NO REPEATING meals across days - provide variety
    3. Mix different cuisines (Indian, Mediterranean, Asian, American, etc.)
    4. Vary cooking methods (grilled, baked, steamed, raw, etc.)
    5. Include seasonal and colorful ingredients
    6. Balance macros: protein, carbs, healthy fats
    7. MANDATORY: TOTAL DAILY CALORIES MUST EQUAL {calories} (±30 calories MAXIMUM)
    
    CALORIE DISTRIBUTION (MUST FOLLOW EXACTLY):
    - Breakfast: {int(calories * 0.30)} calories (30% of {calories})
    - Lunch: {int(calories * 0.35)} calories (35% of {calories})
    - Dinner: {int(calories * 0.35)} calories (35% of {calories})
    - TOTAL: {calories} calories
    
    VERIFICATION CHECKLIST:
    ✓ Add up all breakfast item calories = {int(calories * 0.30)} (±20)
    ✓ Add up all lunch item calories = {int(calories * 0.35)} (±20)
    ✓ Add up all dinner item calories = {int(calories * 0.35)} (±20)
    ✓ Total for the day = {calories} (±30)
    
    If a meal is short on calories, ADD MORE FOOD ITEMS until it reaches the target.
    Each meal should have 3-5 food items to reach the calorie goal.
    
    Each day must include Breakfast, Lunch, Dinner.
    Each meal must contain 3-5 food items with:
    - name (string) - be specific and appetizing
    - calories (number) - MUST be accurate and realistic
    - protein (number in grams)
    - carbs (number in grams)
    - fat (number in grams)

    Return ONLY valid JSON structured by day number as keys (1, 2, 3, etc.).
    Example format for {calories} calorie target:
    {{
        "1": {{
            "breakfast": [
                {{"name": "Greek Yogurt with Honey and Almonds", "calories": 200, "protein": 15, "carbs": 22, "fat": 7}},
                {{"name": "Fresh Strawberries", "calories": 50, "protein": 1, "carbs": 12, "fat": 0}},
                {{"name": "Whole Grain Toast with Peanut Butter", "calories": 220, "protein": 8, "carbs": 24, "fat": 10}},
                {{"name": "Banana", "calories": 130, "protein": 1, "carbs": 33, "fat": 0}}
            ],
            "lunch": [
                {{"name": "Grilled Chicken Caesar Salad", "calories": 380, "protein": 38, "carbs": 16, "fat": 19}},
                {{"name": "Whole Grain Roll with Butter", "calories": 150, "protein": 5, "carbs": 24, "fat": 4}},
                {{"name": "Apple", "calories": 95, "protein": 0, "carbs": 25, "fat": 0}},
                {{"name": "Hummus with Carrots", "calories": 75, "protein": 3, "carbs": 8, "fat": 4}}
            ],
            "dinner": [
                {{"name": "Baked Salmon with Lemon Butter", "calories": 320, "protein": 36, "carbs": 0, "fat": 18}},
                {{"name": "Roasted Brussels Sprouts with Olive Oil", "calories": 100, "protein": 4, "carbs": 13, "fat": 5}},
                {{"name": "Quinoa Pilaf with Herbs", "calories": 200, "protein": 7, "carbs": 32, "fat": 5}},
                {{"name": "Mixed Green Salad with Dressing", "calories": 80, "protein": 2, "carbs": 6, "fat": 6}}
            ]
        }}
    }}
    
    IMPORTANT: 
    - Return ONLY the JSON object, no additional text
    - Make each day's meals UNIQUE and DIFFERENT
    - VERIFY: breakfast ({int(calories * 0.30)}) + lunch ({int(calories * 0.35)}) + dinner ({int(calories * 0.35)}) = {calories} calories
    - If total is short, add more food items or increase portions
    - Each meal should have 3-5 items to comfortably reach the calorie target
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
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


def recalculate_meal_plan(user_intake_data, target_calories, diet_type, allergies, goal, remaining_days):
    """
    Recalculate meal plan based on what user actually ate
    
    Args:
        user_intake_data (dict): What user ate/skipped in recent days
            Example: {
                'total_calories': 1800,
                'total_protein': 80,
                'total_carbs': 200,
                'total_fat': 60,
                'days_tracked': 3,
                'deficit_or_surplus': -600  # negative = deficit, positive = surplus
            }
        target_calories (int): Daily calorie target
        diet_type (str): Dietary preference
        allergies (str): Allergies
        goal (str): Fitness goal
        remaining_days (int): Days left in the plan
    
    Returns:
        dict: Adjusted meal plan for remaining days
    """
    
    # Calculate adjustments needed
    avg_daily_intake = user_intake_data['total_calories'] / user_intake_data['days_tracked']
    daily_deficit = target_calories - avg_daily_intake
    
    # Determine adjustment strategy
    if daily_deficit > 200:
        adjustment_note = f"You've been eating {int(daily_deficit)} calories below target. Increasing portions slightly."
        adjusted_calories = target_calories + 100  # Slightly increase to help reach goal
    elif daily_deficit < -200:
        adjustment_note = f"You've been eating {int(abs(daily_deficit))} calories above target. Reducing portions slightly."
        adjusted_calories = target_calories - 100  # Slightly decrease
    else:
        adjustment_note = "You're on track! Maintaining current calorie level."
        adjusted_calories = target_calories
    
    # Calculate macro adjustments
    protein_ratio = user_intake_data['total_protein'] / user_intake_data['total_calories'] if user_intake_data['total_calories'] > 0 else 0.25
    carbs_ratio = user_intake_data['total_carbs'] / user_intake_data['total_calories'] if user_intake_data['total_calories'] > 0 else 0.50
    fat_ratio = user_intake_data['total_fat'] / user_intake_data['total_calories'] if user_intake_data['total_calories'] > 0 else 0.25
    
    feedback = {
        'calories': int(avg_daily_intake),
        'protein': int(user_intake_data['total_protein'] / user_intake_data['days_tracked']),
        'carbs': int(user_intake_data['total_carbs'] / user_intake_data['days_tracked']),
        'fat': int(user_intake_data['total_fat'] / user_intake_data['days_tracked']),
        'adjustment_note': adjustment_note,
        'protein_ratio': protein_ratio,
        'carbs_ratio': carbs_ratio,
        'fat_ratio': fat_ratio
    }
    
    # Generate new plan with adjustments
    new_plan = generate_meal_plan(
        calories=adjusted_calories,
        diet_type=diet_type,
        allergies=allergies,
        goal=goal,
        days=remaining_days,
        feedback=feedback
    )
    
    return {
        'meal_plan': new_plan,
        'adjustment_note': adjustment_note,
        'adjusted_calories': adjusted_calories,
        'original_target': target_calories
    }
