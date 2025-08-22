from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
import json
import os
from pathlib import Path
import joblib
import csv
import logging
import pandas as pd   # FIXED - used for aligning features with ML models
import numpy as np

from .models import Dam, Contact, LetUsKnow, Feedback

# ------------------------------------------------------
# Logging configuration
# ------------------------------------------------------
logger = logging.getLogger(__name__)

# ------------------------------------------------------
# Load ML models
# ------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
try:
    geo_model_data = joblib.load(os.path.join(BASE_DIR, 'geological_model.pkl'))
    clim_model_data = joblib.load(os.path.join(BASE_DIR, 'climatic_model.pkl'))  # matches training script
    geo_model = geo_model_data["model"]
    clim_model = clim_model_data["model"]
except Exception as e:
    logger.error(f"Error loading ML models: {str(e)}")
    geo_model_data, clim_model_data, geo_model, clim_model = None, None, None, None


# ------------------------------------------------------
# Helpers
# ------------------------------------------------------
def get_suitability_level(score):
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


def send_thank_you_email(name, email):
    """Send thank-you email after form submissions"""
    try:
        send_mail(
            subject="Thank You for Reaching Out!",
            message=f"Dear {name},\n\nThank you for contacting PlanetPulse. We appreciate your input and will respond if necessary.\n\nBest regards,\nTeam PlanetPulse",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True,
        )
    except Exception as e:
        logger.warning(f"Failed to send thank-you email to {email}: {str(e)}")


# ------------------------------------------------------
# ML Prediction Endpoint
# ------------------------------------------------------
@csrf_exempt
@require_http_methods(["POST"])
def predict_suitability(request):
    try:
        data = json.loads(request.body)
        logger.info("Incoming data keys: %s", list(data.keys()))

        if geo_model is None:
            return JsonResponse({'status': 'error', 'message': 'Geological model not loaded'}, status=500)

        # -------- FEATURE MAPPING (frontend → training features) --------
        feature_mapping = {
            # Geo
            "latitude": "Latitude",
            "longitude": "Longitude",
            "elevation": "Elevation",
            "slope": "Slope(%)",
            "mainSoilType": "SoilType_Main",
            "secondarySoilType": "SoilType_Secondary",
            "seismicZone": "Seismic_Zone",
            "damType": "Type",
            "length": "Length (m)",
            "maxHeight": "Max Height above Foundation (m)",
            "riverDistance": "RiverDistance(km)",
            "riverFlowRate": "RiverFlowRate(m/day)",
            # Climate
            "rainfall2020": "Rainfall_2020",
            "rainfall2021": "Rainfall_2021",
            "rainfall2022": "Rainfall_2022",
            "rainfall2023": "Rainfall_2023",
            "rainfall2024": "Rainfall_2024",
            "rainfall5YearAvg": "Rainfall_5yr_Avg",
            "rainfallStdDev5yr": "Rainfall_StdDev_5yr",
            "maxAnnualRainfall": "Max_Annual_Rainfall",
            "minAnnualRainfall": "Min_Annual_Rainfall",
            "monsoonIntensity": "MonsoonIntensityAvg(mm/wet_day)",
            "extremeRainfallDays": "Extreme_Rainfall_Days",
            "floodRiskIndex": "Flood_Risk_Index",
            "cycloneExposure": "Cyclone_Exposure",
            "avgTemperature5yr": "Avg_Temperature_5yr",
            "maxTemperatureLast5yr": "Max_Temperature_Last5yr",
            "temperatureStdDev5yr": "Temperature_StdDev_5yr",
            "heatwaveDaysPerYear": "Heatwave_Days_PerYear",
            "ensoImpactIndex": "ENSO_Impact_Index",
            "climateVulnerabilityIndex": "Climate_Vulnerability_Index",
            "ndvi2025": "NDVI_2025(avg)"
        }

        # Apply mapping
        mapped_data = {v: data[k] for k, v in feature_mapping.items() if k in data}
        logger.info("Mapped data: %s", mapped_data)

        # ---------- Sanitize Input (convert 'Unknown' / non-numeric to 0) ----------
        for key, val in mapped_data.items():
            try:
                if isinstance(val, str) and (val.strip().lower() == "unknown" or not val.strip()):
                    mapped_data[key] = 0
                else:
                    mapped_data[key] = float(val)
            except Exception:
                mapped_data[key] = 0

        # -------- Geological Prediction --------
        try:
            geo_features = geo_model_data['features']
            geo_scaler = geo_model_data.get('scaler')
            geo_df = pd.DataFrame([mapped_data]).reindex(columns=geo_features, fill_value=0)
            if geo_scaler:
                geo_df = geo_scaler.transform(geo_df)
            geo_score = geo_model.predict(geo_df)[0]
        except Exception as e:
            logger.error(f"Geo prediction error: {str(e)}", exc_info=True)
            return JsonResponse({'status': 'error', 'message': f'Geological prediction failed: {str(e)}'}, status=500)

        response = {
            'status': 'success',
            'predictions': {
                'geological_suitability': {
                    'score': round(float(geo_score), 2),
                    'level': get_suitability_level(geo_score)
                }
            }
        }

        # -------- Climatic Prediction --------
        if clim_model:
            try:
                clim_features = clim_model_data['features']
                clim_scaler = clim_model_data.get('scaler')
                clim_df = pd.DataFrame([mapped_data]).reindex(columns=clim_features, fill_value=0)
                if clim_scaler:
                    clim_df = clim_scaler.transform(clim_df)
                clim_score = clim_model.predict(clim_df)[0]

                response['predictions']['climate_impact'] = {
                    'score': round(float(clim_score), 2),
                    'level': get_suitability_level(clim_score)
                }

                overall_score = geo_score * 0.6 + clim_score * 0.4
                response['predictions']['overall_suitability'] = {
                    'score': round(overall_score, 2),
                    'level': get_suitability_level(overall_score)
                }
            except Exception as e:
                logger.error(f"Climate prediction error: {str(e)}")
                response['warnings'] = f'Climate impact prediction skipped: {str(e)}'
        else:
            logger.warning("Climate model not loaded, skipping climate prediction")

        return JsonResponse(response)

    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        return JsonResponse({'status': 'error', 'message': 'An error occurred during prediction'}, status=500)


# ------------------------------------------------------
# CSV Loader
# ------------------------------------------------------
def dams_csv(request):
    """
    Return JSON list of dams loaded from Dams_Gujarat.csv.
    Only returns required fields.
    """
    csv_path = Path(__file__).resolve().parent.parent / 'Dams_Gujarat.csv'
    required_fields = [
        'Name', 'Latitude', 'Longitude', 'Purpose', 'River', 'Nearest City', 'District', 'Elevation', 'Type',
        'Length (m)', 'Max Height above Foundation (m)', 'Geological_Suitability_Score', 'Climatic_Effect_Score',
        'Overall_Suitability_Score', 'Geological_Suitability_Category', 'Climatic_Effect_Category',
        'Overall_Suitability_Category', 'NearestRiver', 'RiverDistance(km)', 'RiverFlowRate(m/day)'
    ]

    dams = []
    try:
        with open(csv_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                dam_data = {field: row.get(field, None) for field in required_fields}
                for numeric_field in [
                    'Latitude', 'Longitude', 'Elevation', 'Length (m)', 'Max Height above Foundation (m)',
                    'Geological_Suitability_Score', 'Climatic_Effect_Score', 'Overall_Suitability_Score',
                    'RiverDistance(km)', 'RiverFlowRate(m/day)'
                ]:
                    if dam_data[numeric_field]:
                        try:
                            dam_data[numeric_field] = float(dam_data[numeric_field])
                        except ValueError:
                            dam_data[numeric_field] = None
                dams.append(dam_data)
    except FileNotFoundError:
        logger.error(f"CSV file not found at {csv_path}")
        return JsonResponse({'status': 'error', 'message': 'Dams CSV file not found'}, status=500)
    except Exception as e:
        logger.error(f"Error reading dams CSV: {str(e)}")
        return JsonResponse({'status': 'error', 'message': 'Error reading dams data'}, status=500)

    return JsonResponse(dams, safe=False)


# ------------------------------------------------------
# Form Handlers
# ------------------------------------------------------
@csrf_exempt
@require_http_methods(["POST"])
def submit_contact_form(request):
    try:
        data = json.loads(request.body)
        name = data.get('name', '')
        email = data.get('email', '')
        subject = data.get('subject', '')
        message = data.get('message', '')

        Contact.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message,
            created_at=timezone.now()
        )

        send_mail(
            subject=f"New Contact Form: {subject}",
            message=f"From: {name} <{email}>\n\nMessage:\n{message}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True,
        )
        send_thank_you_email(name, email)

        return JsonResponse({'status': 'success', 'message': 'Contact form submitted successfully'})
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    except Exception as e:
        logger.error(f"Contact form submission error: {str(e)}", exc_info=True)
        return JsonResponse({'status': 'error', 'message': 'Error submitting contact form'}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def submit_letusknow_form(request):
    try:
        data = json.loads(request.body)
        name = data.get('name', '')
        email = data.get('email', '')
        organization = data.get('organization', '')
        message = data.get('message', '')

        LetUsKnow.objects.create(
            name=name,
            email=email,
            organization=organization,
            message=message,
            created_at=timezone.now()
        )

        send_mail(
            subject=f"New LetUsKnow Form from {name}",
            message=f"Organization (Dam Name): {organization}\nEmail: {email}\n\nMessage:\n{message}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True,
        )
        send_thank_you_email(name, email)

        return JsonResponse({'status': 'success', 'message': 'LetUsKnow form submitted successfully'})
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    except Exception as e:
        logger.error(f"LetUsKnow form submission error: {str(e)}", exc_info=True)
        return JsonResponse({'status': 'error', 'message': 'Error submitting LetUsKnow form'}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def submit_feedback_form(request):
    try:
        data = json.loads(request.body)
        name = data.get('name', '')
        email = data.get('email', '')
        feedback_msg = data.get('feedback', '')

        Feedback.objects.create(
            name=name,
            email=email,
            feedback=feedback_msg,
            created_at=timezone.now()
        )

        send_mail(
            subject=f"New Feedback from {name}",
            message=f"Email: {email}\n\nMessage:\n{feedback_msg}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True,
        )
        send_thank_you_email(name, email)

        return JsonResponse({'status': 'success', 'message': 'Feedback submitted successfully'})
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    except Exception as e:
        logger.error(f"Feedback form submission error: {str(e)}", exc_info=True)
        return JsonResponse({'status': 'error', 'message': 'Error submitting feedback form'}, status=500)
