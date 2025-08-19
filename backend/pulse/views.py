from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import os
import csv
import pickle
import numpy as np
from pathlib import Path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.mail import send_mail
from django.conf import settings
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Load ML models
BASE_DIR = Path(__file__).resolve().parent.parent

try:
    # Load geological model
    with open(os.path.join(BASE_DIR, 'geological_model.pkl'), 'rb') as f:
        geo_model_data = pickle.load(f)
    geo_model = geo_model_data['model']
    geo_scaler = geo_model_data['scaler']
    geo_encoders = geo_model_data.get('label_encoders', {})
    
    # Load climate model if available
    climate_model = None
    climate_scaler = None
    if os.path.exists(os.path.join(BASE_DIR, 'climate_model.pkl')):
        with open(os.path.join(BASE_DIR, 'climate_model.pkl'), 'rb') as f:
            climate_model_data = pickle.load(f)
            climate_model = climate_model_data['model']
            climate_scaler = climate_model_data.get('scaler')
            
except Exception as e:
    logger.error(f"Error loading ML models: {str(e)}")
    raise

def preprocess_input(data, model_type='geological'):
    """Preprocess input data for prediction"""
    try:
        # Create a copy of input data
        processed = data.copy()
        
        # Convert numeric fields - including all model features
        numeric_fields = [
            'seismic_zone',     # Seismic_Zone
            'elevation',        # Elevation (m)
            'slope',            # Slope (%)
            'dam_length',       # Length (m)
            'max_height',       # Max Height above Foundation (m)
            'river_distance',   # Additional field if needed
            'river_flow_rate'   # Additional field if needed
        ]
        for field in numeric_fields:
            if field in processed:
                processed[field] = float(processed[field]) if processed[field] not in [None, ''] else 0.0
        
        # Encode categorical features
        if model_type == 'geological':
            categorical_fields = ['main_soil_type', 'secondary_soil_type']
            for field in categorical_fields:
                if field in processed and field in geo_encoders:
                    processed[field] = geo_encoders[field].transform([processed[field]])[0] if processed[field] else 0
        
        return processed
    except Exception as e:
        logger.error(f"Error in preprocessing: {str(e)}")
        raise

@csrf_exempt
@require_http_methods(["POST"])
def predict_suitability(request):
    try:
        # Parse input data
        data = json.loads(request.body)
        
        # Preprocess input for geological prediction
        geo_input = preprocess_input(data, 'geological')
        
        # Prepare feature vector with all 7 required features in the correct order
        geo_features = [
            float(geo_input.get('seismic_zone', 0)),        # Seismic_Zone
            float(geo_input.get('elevation', 0)),           # Elevation (m)
            float(geo_input.get('slope', 0)),               # Slope (%)
            int(geo_input.get('main_soil_type', 0)),        # SoilType_Main (encoded)
            int(geo_input.get('secondary_soil_type', 0)),   # SoilType_Secondary (encoded)
            float(geo_input.get('dam_length', 0)),          # Length (m)
            float(geo_input.get('max_height', 0))           # Max Height above Foundation (m)
        ]
        
        # Scale features
        geo_features_scaled = geo_scaler.transform([geo_features])
        
        # Make prediction
        geo_score = float(geo_model.predict(geo_features_scaled)[0])
        
        # Prepare response
        response = {
            'status': 'success',
            'predictions': {
                'geological_suitability': {
                    'score': round(geo_score, 2),
                    'level': get_suitability_level(geo_score)
                }
            }
        }
        
        # Add climate prediction
        try:
            # Get base values from the request
            rainfall_5yr_avg = float(data.get('rainfall5YearAvg', 0))
            monsoon_intensity = float(data.get('monsoonIntensity', 0))
            elevation = float(data.get('elevation', 0))
            
            # Calculate derived features (simplified for demonstration)
            # In a real scenario, these would be calculated from historical data
            rainfall_std = rainfall_5yr_avg * 0.15  # 15% of avg as std dev
            max_rainfall = rainfall_5yr_avg * 1.3   # 30% higher than avg
            min_rainfall = rainfall_5yr_avg * 0.7   # 30% lower than avg
            
            # Prepare all 28 features in the exact order expected by the model
            climate_features = [
                rainfall_5yr_avg * 0.9,  # Rainfall_2020
                rainfall_5yr_avg * 1.0,  # Rainfall_2021
                rainfall_5yr_avg * 1.1,  # Rainfall_2022
                rainfall_5yr_avg * 0.95, # Rainfall_2023
                rainfall_5yr_avg * 1.05, # Rainfall_2024
                rainfall_5yr_avg,        # Rainfall_5yr_Avg
                monsoon_intensity,        # MonsoonIntensityAvg(mm/wet_day)
                150.0,                   # RiverFlowRate(m/day) - example value
                2.5,                     # RiverDistance(km) - example value
                rainfall_std,             # Rainfall_StdDev_5yr
                max_rainfall,             # Max_Annual_Rainfall
                min_rainfall,             # Min_Annual_Rainfall
                28.0,                     # Avg_Temperature_5yr - example value
                2.0,                      # Temperature_StdDev_5yr - example value
                12,                       # Heatwave_Days_PerYear - example value
                0.3,                      # Flood_Risk_Index - example value
                0.4,                      # Climate_Vulnerability_Index - example value
                8,                        # Extreme_Rainfall_Days - example value
                rainfall_5yr_avg,         # Rainfall_Mean
                rainfall_std,             # Rainfall_StdDev
                max_rainfall - min_rainfall, # Rainfall_Range
                0.02,                     # Rainfall_Trend - example value
                0.8,                      # Flow_Rainfall_Ratio - example value
                0.6,                      # River_Impact_Score - example value
                0.5,                      # Temp_Anomaly - example value
                0.4,                      # Heat_Stress_Index - example value
                0.3,                      # Flood_Risk_Adjusted - example value
                0.5                       # Climate_Risk_Score - example value
            ]
            
            logger.info(f"Climate features prepared: {[round(x, 2) for x in climate_features]}")
            
            # Scale features if scaler is available
            if climate_scaler and climate_model:
                climate_features_scaled = climate_scaler.transform([climate_features])
                logger.info(f"Climate features after scaling: {climate_features_scaled[0].tolist()}")
                
                # Make climate prediction
                climate_impact = float(climate_model.predict(climate_features_scaled)[0])
                logger.info(f"Climate impact score: {climate_impact}")
                
                # Add climate prediction to response
                response['predictions']['climate_impact'] = {
                    'score': round(climate_impact, 2),
                    'level': get_suitability_level(climate_impact),
                    'features_used': len(climate_features)
                }
                
                # Calculate overall score (weighted average: 60% geological, 40% climate)
                overall_score = (geo_score * 0.6) + (climate_impact * 0.4)
                response['predictions']['overall_suitability'] = {
                    'score': round(overall_score, 2),
                    'level': get_suitability_level(overall_score)
                }
                
            else:
                logger.warning("Climate scaler not available, skipping climate prediction")
                response['warnings'] = 'Climate impact prediction skipped: scaler not available'
                
        except Exception as e:
            logger.error(f"Climate prediction error: {str(e)}", exc_info=True)
            response['warnings'] = f'Climate impact prediction skipped: {str(e)}'
            
        return JsonResponse(response)
        
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

def get_suitability_level(score):
    """Convert numerical score to human-readable level"""
    if score >= 80:
        return 'Excellent'
    elif score >= 70:
        return 'Good'
    elif score >= 60:
        return 'Moderate'
    elif score >= 50:
        return 'Fair'
    else:
        return 'Poor'

def dams_list(request):
    return JsonResponse(list(Dam.objects.values()), safe=False)

def dams_csv(request):
    csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'Dams_Gujarat.csv')
    dams = []
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            try:
                row['Latitude'] = float(row['Latitude'])
                row['Longitude'] = float(row['Longitude'])
                dams.append(row)
            except: continue
    return JsonResponse(dams, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def submit_contact_form(request):
    try:
        logger.info("Starting contact form submission")
        data = json.loads(request.body)
        name = data.get('name', '')
        email = data.get('email', '')
        subject = data.get('subject', 'No Subject')
        message = data.get('message', '')
        
        # Validate required fields
        if not all([name, email, message]):
            return JsonResponse({'status': 'error', 'message': 'Name, email, and message are required fields.'}, status=400)
        
        # Save the contact form
        logger.info(f"Saving contact form for {email}")
        Contact.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
        )
        
        # Send thank you email
        email_subject = "Thank you for contacting PlanetPulse!"
        email_message = f"""
        Dear {name},
        
        Thank you for reaching out to PlanetPulse! We've received your message and our team will get back to you within 24-48 hours.
        
        Here's a summary of your submission:
        Subject: {subject}
        Message: {message}
        
        Best regards,
        The PlanetPulse Team
        """
        
        logger.info(f"Attempting to send email to {email}")
        try:
            send_mail(
                email_subject,
                email_message.strip(),
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            logger.info(f"Successfully sent email to {email}")
        except Exception as email_error:
            logger.error(f"Failed to send email to {email}: {str(email_error)}")
            # Don't fail the request if email fails, just log it
            return JsonResponse({
                'status': 'success', 
                'message': 'Thank you for contacting us! (Note: Email notification failed, but your message was received)'
            })
        
        return JsonResponse({
            'status': 'success', 
            'message': 'Thank you for contacting us! You will receive a confirmation email shortly.'
        })
        
    except json.JSONDecodeError:
        logger.error("Invalid JSON in request body")
        return JsonResponse({'status': 'error', 'message': 'Invalid request format'}, status=400)
    except Exception as e:
        error_msg = f"Error in submit_contact_form: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return JsonResponse({'status': 'error', 'message': 'An error occurred while processing your request. Please try again later.'}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def submit_letusknow_form(request):
    try:
        data = json.loads(request.body)
        name = data.get('name', '')
        email = data.get('email', '')
        organization = data.get('organization', 'Not specified')
        message = data.get('message', '')
        
        # Save the submission
        LetUsKnow.objects.create(
            name=name,
            email=email,
            organization=organization,
            message=message
        )
        
        # Send thank you email
        email_subject = "Thank you for your submission to PlanetPulse!"
        email_message = f"""
        Dear {name},
        
        Thank you for taking the time to share your information with PlanetPulse! We've received your submission and our team will review it shortly.
        
        Here's a summary of your submission:
        Organization: {organization}
        Message: {message}
        
        We appreciate your contribution to our platform. If we need any additional information, we'll reach out to you at this email address.
        
        Best regards,
        The PlanetPulse Team
        """
        
        send_mail(
            email_subject,
            email_message.strip(),
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        
        return JsonResponse({'status': 'success', 'message': 'Thank you for your submission! You will receive a confirmation email shortly.'})
    except Exception as e:
        logger.error(f"Error in submit_letusknow_form: {str(e)}")
        return JsonResponse({'status': 'error', 'message': 'An error occurred while processing your submission. Please try again later.'}, status=500)
