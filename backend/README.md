# PlanetPulse Backend

Django backend for geological suitability analysis with ML models.

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Train ML Models
```bash
python train_ml_models.py
```
This will create:
- `geological_model.pkl`
- `climate_model.pkl`

### 3. Run Django Server
```bash
python manage.py runserver
```

The server will start at `http://localhost:8000`

## API Endpoints

### POST /api/predict/
Predicts geological suitability and climatic effects.

**Request Body:**
```json
{
  "district": "Ahmedabad",
  "damType": "Gravity",
  "maxHeight": 50.0,
  "seismicZone": 2,
  "elevation": 100.0,
  "length": 200.0,
  "slope": 15.0,
  "mainSoilType": "Vertisols",
  "secondarySoilType": "Cambisols",
  "riverDistance": 5.0,
  "riverFlowRate": 100.0,
  "rainfall2020": 800.0,
  "rainfall2021": 850.0,
  "rainfall2022": 900.0,
  "rainfall2023": 750.0,
  "rainfall2024": 820.0,
  "rainfall5YearAvg": 824.0,
  "monsoonIntensity": 0.8,
  "ndvi": 0.6
}
```

**Response:**
```json
{
  "success": true,
  "predictions": {
    "geological_suitability": {
      "score": 75.5,
      "level": "Good",
      "description": "Good geological conditions with manageable risks for dam construction."
    },
    "climatic_effects": {
      "score": 82.3,
      "level": "Excellent",
      "description": "Excellent climatic conditions with stable weather patterns and adequate water availability."
    }
  },
  "input_data": {...}
}
```

## File Structure
```
backend/
├── manage.py
├── requirements.txt
├── README.md
├── train_ml_models.py
├── Dams_Gujarat.csv
├── geological_model.pkl (generated)
├── climate_model.pkl (generated)
├── backend/
│   ├── settings.py
│   ├── urls.py
│   └── ...
└── pulse/
    ├── views.py
    ├── urls.py
    └── ...
```

## CORS Configuration
The backend is configured to allow CORS from the frontend (localhost:5173) for development. 