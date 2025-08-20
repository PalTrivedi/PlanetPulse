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

from .models import Dam, Contact, LetUsKnow, Feedback 

# Configure logging
logger = logging.getLogger(__name__)

# Base directory for model files
BASE_DIR = Path(__file__).resolve().parent.parent

# Load ML models (entire sklearn pipelines)
try:
    geo_model = joblib.load(os.path.join(BASE_DIR, 'geological_model.pkl'))
    clim_model = joblib.load(os.path.join(BASE_DIR, 'climatic_model.pkl'))
except Exception as e:
    logger.error(f"Error loading ML models: {str(e)}")
    geo_model = None
    clim_model = None


def preprocess_geo_input(data):
    feature_order = [
        'Latitude', 'Longitude', 'Elevation', 'Slope(%)', 'SoilType_Main',
        'SoilType_Secondary', 'Seismic_Zone', 'Type', 'Length (m)',
        'Max Height above Foundation (m)', 'RiverDistance(km)', 'RiverFlowRate(m/day)'
    ]
    key_mapping = {
        'latitude': 'Latitude',
        'longitude': 'Longitude',
        'elevation': 'Elevation',
        'slope': 'Slope(%)',
        'main_soil_type': 'SoilType_Main',
        'secondary_soil_type': 'SoilType_Secondary',
        'seismic_zone': 'Seismic_Zone',
        'type': 'Type',
        'dam_length': 'Length (m)',
        'max_height': 'Max Height above Foundation (m)',
        'river_distance': 'RiverDistance(km)',
        'river_flow_rate': 'RiverFlowRate(m/day)'
    }
    features = []
    inv_map = {v: k for k, v in key_mapping.items()}
    for feat_name in feature_order:
        input_key = inv_map.get(feat_name)
        val = data.get(input_key, 0)
        try:
            val = float(val)
        except Exception:
            val = 0.0
        features.append(val)
    return [features]


def preprocess_clim_input(data):
    feature_order = [
        'Rainfall_2020', 'Rainfall_2021', 'Rainfall_2022', 'Rainfall_2023', 'Rainfall_2024',
        'Rainfall_5yr_Avg', 'Rainfall_StdDev_5yr', 'Max_Annual_Rainfall', 'Min_Annual_Rainfall',
        'MonsoonIntensityAvg(mm/wet_day)', 'Extreme_Rainfall_Days', 'Flood_Risk_Index',
        'Cyclone_Exposure', 'Avg_Temperature_5yr', 'Max_Temperature_Last5yr',
        'Temperature_StdDev_5yr', 'Heatwave_Days_PerYear', 'ENSO_Impact_Index',
        'Climate_Vulnerability_Index', 'NDVI_2025(avg)'
    ]
    key_mapping = {
        'rainfall_2020': 'Rainfall_2020',
        'rainfall_2021': 'Rainfall_2021',
        'rainfall_2022': 'Rainfall_2022',
        'rainfall_2023': 'Rainfall_2023',
        'rainfall_2024': 'Rainfall_2024',
        'rainfall_5yr_avg': 'Rainfall_5yr_Avg',
        'rainfall_stddev_5yr': 'Rainfall_StdDev_5yr',
        'max_annual_rainfall': 'Max_Annual_Rainfall',
        'min_annual_rainfall': 'Min_Annual_Rainfall',
        'monsoon_intensity_avg': 'MonsoonIntensityAvg(mm/wet_day)',
        'extreme_rainfall_days': 'Extreme_Rainfall_Days',
        'flood_risk_index': 'Flood_Risk_Index',
        'cyclone_exposure': 'Cyclone_Exposure',
        'avg_temperature_5yr': 'Avg_Temperature_5yr',
        'max_temperature_last5yr': 'Max_Temperature_Last5yr',
        'temperature_stddev_5yr': 'Temperature_StdDev_5yr',
        'heatwave_days_peryear': 'Heatwave_Days_PerYear',
        'enso_impact_index': 'ENSO_Impact_Index',
        'climate_vulnerability_index': 'Climate_Vulnerability_Index',
        'ndvi_2025_avg': 'NDVI_2025(avg)'
    }
    features = []
    inv_map = {v: k for k, v in key_mapping.items()}
    for feat_name in feature_order:
        input_key = inv_map.get(feat_name)
        val = data.get(input_key, 0)
        try:
            val = float(val)
        except Exception:
            val = 0.0
        features.append(val)
    return [features]


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


@csrf_exempt
@require_http_methods(["POST"])
def predict_suitability(request):
    try:
        data = json.loads(request.body)

        if geo_model is None:
            return JsonResponse({'status': 'error', 'message': 'Geological model not loaded'}, status=500)

        geo_features = preprocess_geo_input(data)
        geo_score = geo_model.predict(geo_features)[0]

        response = {
            'status': 'success',
            'predictions': {
                'geological_suitability': {
                    'score': round(float(geo_score), 2),
                    'level': get_suitability_level(geo_score)
                }
            }
        }

        if clim_model:
            try:
                clim_features = preprocess_clim_input(data)
                clim_score = clim_model.predict(clim_features)[0]
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


def dams_csv(request):
    """
    Return JSON list of dams loaded from Dams_Gujarat.csv in the backend folder.
    Only returns specified fields.
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
                # Convert numeric fields to floats
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


# def dams_csv(request):
#     """Return CSV file response of all dams from the database."""
#     dams = Dam.objects.all()
#     response = HttpResponse(content_type='text/csv')
#     response['Content-Disposition'] = 'attachment; filename="dams.csv"'

#     writer = csv.writer(response)
#     writer.writerow(['Name', 'Latitude', 'Longitude', 'Capacity', 'River', 'Type', 'Height', 'Year Completed', 'Purpose', 'Description'])

#     for dam in dams:
#         writer.writerow([
#             dam.name, dam.latitude, dam.longitude, dam.capacity, dam.river,
#             dam.type, dam.height, dam.year_completed, dam.purpose, dam.description
#         ])

#     return response


@csrf_exempt
@require_http_methods(["POST"])
def submit_contact_form(request):
    try:
        data = json.loads(request.body)
        name = data.get('name', '')
        email = data.get('email', '')
        subject = data.get('subject', '')
        message = data.get('message', '')

        contact = Contact.objects.create(
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
            recipient_list=[email],  # changed here
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

        letusknow = LetUsKnow.objects.create(
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
            recipient_list=[email],  # changed here
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
            recipient_list=[email],  # changed here
            fail_silently=True,
        )

        send_thank_you_email(name, email)

        return JsonResponse({'status': 'success', 'message': 'Feedback submitted successfully'})

    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    except Exception as e:
        logger.error(f"Feedback form submission error: {str(e)}", exc_info=True)
        return JsonResponse({'status': 'error', 'message': 'Error submitting feedback form'}, status=500)


def send_thank_you_email(name, email):
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
