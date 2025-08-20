from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_suitability, name='predict_suitability'),
    path('dams_csv/', views.dams_csv, name='dams_csv'),
    path('contact/submit/', views.submit_contact_form, name='submit_contact_form'),
    path('letusknow/submit/', views.submit_letusknow_form, name='submit_letusknow_form'),
    path('feedback/submit/', views.submit_feedback_form, name='submit_feedback_form'),  # ✅ New route
]
