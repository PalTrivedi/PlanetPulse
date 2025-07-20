from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_suitability, name='predict_suitability'),
    path('dams/', views.dams_list, name='dams_list'),
    path('dams_csv/', views.dams_csv, name='dams_csv'),
] 