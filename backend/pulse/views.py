import pickle
import pandas as pd
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import os

# Load models at module level (will be loaded when Django starts)
def load_models():
    """Load the trained ML models"""
    try:
        # Get the directory where this file is located
        current_dir = os.path.dirname(os.path.abspath(__file__))
        parent_dir = os.path.dirname(current_dir)
        
        # Check if model files exist
        geo_model_path = os.path.join(parent_dir, 'geological_model.pkl')
        climate_model_path = os.path.join(parent_dir, 'climate_model.pkl')
        
        geological_model_data = None
        climate_model_data = None
        
        # Load geological model if exists
        if os.path.exists(geo_model_path):
            with open(geo_model_path, 'rb') as f:
                geological_model_data = pickle.load(f)
            print("Geological model loaded successfully")
        else:
            print("Geological model file not found, will use fallback")
        
        # Load climate model if exists
        if os.path.exists(climate_model_path):
            with open(climate_model_path, 'rb') as f:
                climate_model_data = pickle.load(f)
            print("Climate model loaded successfully")
        else:
            print("Climate model file not found, will use fallback")
        
        return geological_model_data, climate_model_data
    except Exception as e:
        print(f"Error loading models: {e}")
        return None, None

# Load models when module is imported
geological_model_data, climate_model_data = load_models()

def fallback_geological_prediction(form_data):
    """Fallback prediction when ML model is not available"""
    score = 50  # Base score
    
    # Adjust based on seismic zone (lower is better)
    seismic_zone = int(form_data['seismicZone'])
    if seismic_zone == 1:
        score += 20
    elif seismic_zone == 2:
        score += 15
    elif seismic_zone == 3:
        score += 10
    elif seismic_zone == 4:
        score -= 5
    elif seismic_zone == 5:
        score -= 15
    
    # Adjust based on soil types
    main_soil = form_data['mainSoilType'].lower()
    if 'vertisol' in main_soil:
        score += 10
    elif 'cambisol' in main_soil:
        score += 8
    elif 'luvisol' in main_soil:
        score += 5
    
    # Adjust based on slope (lower is better for dam construction)
    slope = float(form_data['slope'])
    if slope < 10:
        score += 10
    elif slope < 20:
        score += 5
    elif slope > 30:
        score -= 10
    
    # Adjust based on elevation
    elevation = float(form_data['elevation'])
    if 50 <= elevation <= 200:
        score += 5
    elif elevation > 500:
        score -= 5
    
    return max(0, min(100, score))

def fallback_climate_prediction(form_data):
    """Fallback prediction when ML model is not available"""
    score = 50  # Base score
    
    # Adjust based on rainfall average
    avg_rainfall = float(form_data['rainfall5YearAvg'])
    if 600 <= avg_rainfall <= 1000:
        score += 15
    elif 400 <= avg_rainfall < 600:
        score += 10
    elif avg_rainfall > 1200:
        score -= 5
    
    # Adjust based on monsoon intensity
    monsoon_intensity = float(form_data['monsoonIntensity'])
    if 15 <= monsoon_intensity <= 20:
        score += 10
    elif monsoon_intensity > 25:
        score -= 5
    
    # Adjust based on individual rainfall years
    rainfall_2020 = float(form_data['rainfall2020'])
    rainfall_2021 = float(form_data['rainfall2021'])
    rainfall_2022 = float(form_data['rainfall2022'])
    rainfall_2023 = float(form_data['rainfall2023'])
    rainfall_2024 = float(form_data['rainfall2024'])
    
    # Check for consistent rainfall patterns
    rainfall_values = [rainfall_2020, rainfall_2021, rainfall_2022, rainfall_2023, rainfall_2024]
    if all(600 <= r <= 1200 for r in rainfall_values):
        score += 5
    elif any(r < 400 for r in rainfall_values):
        score -= 5
    
    return max(0, min(100, score))

@csrf_exempt
@require_http_methods(["POST"])
def predict_suitability(request):
    """Predict geological suitability and climatic effects"""
    try:
        # Parse JSON data from request
        data = json.loads(request.body)
        
        # Extract form data
        form_data = {
            'district': data.get('district', ''),
            'damType': data.get('damType', ''),
            'maxHeight': float(data.get('maxHeight', 0)),
            'seismicZone': int(data.get('seismicZone', 1)),
            'elevation': float(data.get('elevation', 0)),
            'length': float(data.get('length', 0)),
            'slope': float(data.get('slope', 0)),
            'mainSoilType': data.get('mainSoilType', ''),
            'secondarySoilType': data.get('secondarySoilType', ''),
            'rainfall2020': float(data.get('rainfall2020', 0)),
            'rainfall2021': float(data.get('rainfall2021', 0)),
            'rainfall2022': float(data.get('rainfall2022', 0)),
            'rainfall2023': float(data.get('rainfall2023', 0)),
            'rainfall2024': float(data.get('rainfall2024', 0)),
            'rainfall5YearAvg': float(data.get('rainfall5YearAvg', 0)),
            'monsoonIntensity': float(data.get('monsoonIntensity', 0)),
        }
        
        # Use ML models if available, otherwise use fallback
        if geological_model_data is not None and climate_model_data is not None:
            # Use ML models
            geo_features = prepare_geological_features(form_data, geological_model_data)
            climate_features = prepare_climate_features(form_data, climate_model_data)
            geological_score = predict_geological_suitability(geo_features, geological_model_data)
            climate_score = predict_climatic_effects(climate_features, climate_model_data)
            prediction_method = "ML Models"
        else:
            # Use fallback predictions
            geological_score = fallback_geological_prediction(form_data)
            climate_score = fallback_climate_prediction(form_data)
            prediction_method = "Fallback Algorithm"
        
        # Determine suitability levels
        geological_level = get_suitability_level(geological_score)
        climate_level = get_suitability_level(climate_score)
        
        # Prepare response
        response_data = {
            'success': True,
            'prediction_method': prediction_method,
            'predictions': {
                'geological_suitability': {
                    'score': round(geological_score, 2),
                    'level': geological_level,
                    'description': get_suitability_description(geological_level, 'geological')
                },
                'climatic_effects': {
                    'score': round(climate_score, 2),
                    'level': climate_level,
                    'description': get_suitability_description(climate_level, 'climatic')
                }
            },
            'input_data': form_data
        }
        
        return JsonResponse(response_data)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'Prediction error: {str(e)}'}, status=500)

def prepare_geological_features(form_data, model_data):
    """Prepare geological features for prediction"""
    # Encode soil types using the saved label encoders
    main_soil_encoded = model_data['label_encoders']['SoilType_Main'].transform([form_data['mainSoilType']])[0]
    secondary_soil_encoded = model_data['label_encoders']['SoilType_Secondary'].transform([form_data['secondarySoilType']])[0]
    
    features = [
        form_data['seismicZone'],
        form_data['elevation'],
        form_data['slope'],
        main_soil_encoded,
        secondary_soil_encoded,
        form_data['length'],
        form_data['maxHeight']
    ]
    
    return np.array(features).reshape(1, -1)

def prepare_climate_features(form_data, model_data):
    """Prepare climate features for prediction"""
    features = [
        form_data['rainfall2020'],
        form_data['rainfall2021'],
        form_data['rainfall2022'],
        form_data['rainfall2023'],
        form_data['rainfall2024'],
        form_data['rainfall5YearAvg'],
        form_data['monsoonIntensity']
    ]
    
    return np.array(features).reshape(1, -1)

def predict_geological_suitability(features, model_data):
    """Predict geological suitability score"""
    # Scale features
    features_scaled = model_data['scaler'].transform(features)
    
    # Make prediction
    prediction = model_data['model'].predict(features_scaled)[0]
    
    # Ensure prediction is within 0-100 range
    return max(0, min(100, prediction))

def predict_climatic_effects(features, model_data):
    """Predict climatic effects score"""
    # Scale features
    features_scaled = model_data['scaler'].transform(features)
    
    # Make prediction
    prediction = model_data['model'].predict(features_scaled)[0]
    
    # Ensure prediction is within 0-100 range
    return max(0, min(100, prediction))

def get_suitability_level(score):
    """Convert score to suitability level"""
    if score >= 80:
        return 'Excellent'
    elif score >= 60:
        return 'Good'
    elif score >= 40:
        return 'Moderate'
    elif score >= 20:
        return 'Poor'
    else:
        return 'Very Poor'

def get_suitability_description(level, prediction_type):
    """Get description for suitability level"""
    descriptions = {
        'geological': {
            'Excellent': 'Highly suitable geological conditions for dam construction with minimal risks.',
            'Good': 'Good geological conditions with manageable risks for dam construction.',
            'Moderate': 'Moderate geological conditions requiring careful planning and additional measures.',
            'Poor': 'Poor geological conditions with significant risks. Detailed assessment required.',
            'Very Poor': 'Very poor geological conditions. High risk of failure. Alternative sites recommended.'
        },
        'climatic': {
            'Excellent': 'Excellent climatic conditions with stable weather patterns and adequate water availability.',
            'Good': 'Good climatic conditions with reliable rainfall and moderate weather variations.',
            'Moderate': 'Moderate climatic conditions with some variability in weather patterns.',
            'Poor': 'Poor climatic conditions with high variability and potential water scarcity.',
            'Very Poor': 'Very poor climatic conditions with extreme weather events and water scarcity.'
        }
    }
    
    return descriptions[prediction_type].get(level, 'Assessment required.')
