from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_suitability, name='predict_suitability'),
    path('dams/', views.dams_list, name='dams_list'),
    path('dams_csv/', views.dams_csv, name='dams_csv'),
    path('contact/submit/', views.submit_contact_form, name='submit_contact_form'),
    path('letusknow/submit/', views.submit_letusknow_form, name='submit_letusknow_form'),
]
