import pickle
import pandas as pd
import numpy as np
from scipy import stats
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import os
from .models import Dam
import csv

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
        
        # Default values for required fields
        default_values = {
            'district': 'Unknown',
            'damType': 'Gravity',  # Most common type
            'maxHeight': 50.0,
            'seismicZone': 2,  # Medium risk as default
            'elevation': 100.0,
            'length': 500.0,
            'slope': 5.0,
            'mainSoilType': 'Vertisols',  # Common in Gujarat
            'secondarySoilType': 'Inceptisols',  # Common secondary type
            'rainfall2020': 800.0,
            'rainfall2021': 800.0,
            'rainfall2022': 800.0,
            'rainfall2023': 800.0,
            'rainfall2024': 800.0,
            'rainfall5YearAvg': 800.0,
            'monsoonIntensity': 15.0,
        }
        
        # Extract and validate form data
        form_data = {}
        for field, default in default_values.items():
            value = data.get(field, default)
            if value == '':  # If empty string, use default
                value = default
            try:
                # Convert to appropriate type
                if isinstance(default, float):
                    form_data[field] = float(value)
                elif isinstance(default, int):
                    form_data[field] = int(value)
                else:  # string
                    form_data[field] = str(value).strip() or default
            except (ValueError, TypeError):
                form_data[field] = default
        
        # Always use fallback predictions for now
        # TODO: Fix ML model loading and encoding issues
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
    # Default soil types (common in training data)
    DEFAULT_MAIN_SOIL = 'Vertisols'
    DEFAULT_SECONDARY_SOIL = 'Inceptisols'
    
    # Encode soil types using the saved label encoders with fallback for unseen labels
    try:
        main_soil = form_data['mainSoilType']
        if main_soil not in model_data['label_encoders']['SoilType_Main'].classes_:
            main_soil = DEFAULT_MAIN_SOIL
        main_soil_encoded = model_data['label_encoders']['SoilType_Main'].transform([main_soil])[0]
        
        secondary_soil = form_data['secondarySoilType']
        if secondary_soil not in model_data['label_encoders']['SoilType_Secondary'].classes_:
            secondary_soil = DEFAULT_SECONDARY_SOIL
        secondary_soil_encoded = model_data['label_encoders']['SoilType_Secondary'].transform([secondary_soil])[0]
    except Exception as e:
        print(f"Error encoding soil types: {e}")
        # Fallback to default encoding if there's an error
        main_soil_encoded = model_data['label_encoders']['SoilType_Main'].transform([DEFAULT_MAIN_SOIL])[0]
        secondary_soil_encoded = model_data['label_encoders']['SoilType_Secondary'].transform([DEFAULT_SECONDARY_SOIL])[0]
    
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
    # Get base features from form data
    features = {
        'Rainfall_2020': form_data['rainfall2020'],
        'Rainfall_2021': form_data['rainfall2021'],
        'Rainfall_2022': form_data['rainfall2022'],
        'Rainfall_2023': form_data['rainfall2023'],
        'Rainfall_2024': form_data['rainfall2024'],
        'Rainfall_5yr_Avg': form_data['rainfall5YearAvg'],
        'MonsoonIntensityAvg(mm/wet_day)': form_data['monsoonIntensity'],
        # Set default values for other features
        'RiverFlowRate(m/day)': 0.0,  # These should be provided in the form data
        'RiverDistance(km)': 0.0,      # These should be provided in the form data
        'Rainfall_StdDev_5yr': 0.0,
        'Max_Annual_Rainfall': 0.0,
        'Min_Annual_Rainfall': 0.0,
        'Avg_Temperature_5yr': 0.0,
        'Temperature_StdDev_5yr': 0.0,
        'Heatwave_Days_PerYear': 0.0,
        'Flood_Risk_Index': 0.0,
        'Climate_Vulnerability_Index': 0.0,
        'Extreme_Rainfall_Days': 0.0,
        'Rainfall_Mean': 0.0,
        'Rainfall_StdDev': 0.0,
        'Rainfall_Range': 0.0,
        'Rainfall_Trend': 0.0,
        'Flow_Rainfall_Ratio': 0.0,
        'River_Impact_Score': 0.0,
        'Temp_Anomaly': 0.0,
        'Heat_Stress_Index': 0.0,
        'Flood_Risk_Adjusted': 0.0,
        'Climate_Risk_Score': 0.0
    }
    
    # Calculate derived features
    rainfall_values = [
        form_data['rainfall2020'],
        form_data['rainfall2021'],
        form_data['rainfall2022'],
        form_data['rainfall2023'],
        form_data['rainfall2024']
    ]
    
    # Calculate statistics
    features['Rainfall_Mean'] = np.mean(rainfall_values)
    features['Rainfall_StdDev'] = np.std(rainfall_values)
    features['Rainfall_Range'] = max(rainfall_values) - min(rainfall_values)
    
    # Calculate trend (simple linear regression slope)
    if len(rainfall_values) >= 2:
        x = np.arange(len(rainfall_values))
        slope, _, _, _, _ = stats.linregress(x, rainfall_values)
        features['Rainfall_Trend'] = float(slope) if not np.isnan(slope) else 0.0
    
    # Create a DataFrame with the expected feature order
    feature_order = model_data['feature_names'] if 'feature_names' in model_data else features.keys()
    features_ordered = [features[col] for col in feature_order if col in features]
    
    return np.array(features_ordered).reshape(1, -1)

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

@csrf_exempt
def api_dams_list(request):
    """List all dams or create a new dam"""
    if request.method == 'GET':
        dams = Dam.objects.all()
        data = [
            {
                "id": dam.id,
                "name": dam.name,
                "latitude": float(dam.latitude),
                "longitude": float(dam.longitude),
                "capacity": dam.capacity,
                "river": dam.river,
                "type": dam.type,
                "height": dam.height,
                "year_completed": dam.year_completed,
                "purpose": dam.purpose,
                "description": dam.description
            } for dam in dams
        ]
        return JsonResponse({"dams": data}, safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            dam = Dam.objects.create(
                name=data.get('name'),
                latitude=float(data.get('latitude', 0)),
                longitude=float(data.get('longitude', 0)),
                capacity=data.get('capacity', ''),
                river=data.get('river', ''),
                type=data.get('type', ''),
                height=data.get('height', ''),
                year_completed=data.get('year_completed', ''),
                purpose=data.get('purpose', ''),
                description=data.get('description', '')
            )
            return JsonResponse({
                "id": dam.id,
                "message": "Dam created successfully"
            }, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
def api_dam_detail(request, dam_id):
    """Retrieve, update or delete a dam"""
    try:
        dam = Dam.objects.get(id=dam_id)
    except Dam.DoesNotExist:
        return JsonResponse({"error": "Dam not found"}, status=404)
    
    if request.method == 'GET':
        return JsonResponse({
            "id": dam.id,
            "name": dam.name,
            "latitude": float(dam.latitude),
            "longitude": float(dam.longitude),
            "capacity": dam.capacity,
            "river": dam.river,
            "type": dam.type,
            "height": dam.height,
            "year_completed": dam.year_completed,
            "purpose": dam.purpose,
            "description": dam.description
        })
    
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            for field in ['name', 'capacity', 'river', 'type', 'height', 'year_completed', 'purpose', 'description']:
                if field in data:
                    setattr(dam, field, data[field])
            if 'latitude' in data:
                dam.latitude = float(data['latitude'])
            if 'longitude' in data:
                dam.longitude = float(data['longitude'])
            dam.save()
            return JsonResponse({"message": "Dam updated successfully"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    elif request.method == 'DELETE':
        dam.delete()
        return JsonResponse({"message": "Dam deleted successfully"}, status=204)

def dams_list(request):
    """Legacy view for HTML response"""
    dams = Dam.objects.all()
    data = [
        {
            "id": dam.id,
            "name": dam.name,
            "latitude": dam.latitude,
            "longitude": dam.longitude,
            "capacity": dam.capacity,
            "river": dam.river,
            "type": dam.type,
            "height": dam.height,
            "year_completed": dam.year_completed,
            "purpose": dam.purpose,
            "description": dam.description,
        }
        for dam in dams
    ]
    return JsonResponse(data, safe=False)

def dams_csv(request):
    import os
    csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'Dams_Gujarat.csv')
    dams = []
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            try:
                row['Latitude'] = float(row['Latitude'])
                row['Longitude'] = float(row['Longitude'])
            except Exception:
                continue
            dams.append(row)
    return JsonResponse(dams, safe=False)
