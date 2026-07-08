# 🌍 PlanetPulse

**A machine learning system that scores dam site suitability in Gujarat, combining geological stability and climatic risk into a single predictive model, visualized on an interactive map.**

Most "environmental dashboard" projects just plot static data. PlanetPulse trains two regression models on engineered geological and climatic features to *predict* a suitability score for a site, then serves those predictions through a map interface where every dam marker shows its actual model derived score.

![Django](https://img.shields.io/badge/Django-5.2-092E20?logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![scikit--learn](https://img.shields.io/badge/scikit--learn-ML%20Models-F7931E?logo=scikitlearn&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-Map-199900?logo=leaflet&logoColor=white)

---

## What It Does

- **Predicts geological suitability and climatic impact scores** for a candidate dam site, given inputs like elevation, slope, soil type, seismic zone, 5-year rainfall trends, flood risk index, and heatwave frequency
- **Combines both into an overall suitability score** (weighted 60% geological / 40% climatic), classified into Excellent → Poor bands
- **Visualizes Gujarat's existing dam network** on an interactive Leaflet map, with each dam marker popup showing its real specifications and computed suitability scores
- **Collects public feedback** (Contact, Feedback, and "Let Us Know" forms) with backend-triggered email acknowledgements

## How the Models Work

Rather than hand-labeling every training example, the training pipeline (`dam_scoring.py`) first computes a **domain-informed heuristic score** for each dam weighting factors like seismic zone, soil type, slope, elevation, and dam height for geological suitability, and rainfall patterns, flood risk, and temperature trends for climatic impact.

These heuristic scores become the training targets for two gradient boosting regressors (`train_models.py`), which then generalize the scoring logic beyond the hand coded rules to any new site's feature values.

| Model | Test R² | Test MSE |
|---|---|---|
| Geological Suitability | 0.85 | 8.63 |
| Climatic Impact | 0.68 | 6.17 |

Predictions are served through a single Django endpoint (`/api/predict/`) that maps incoming site features to the models' expected feature names, runs both models, and returns geological, climatic, and blended overall scores.

## Tech Stack

| Layer | Technology |
|---|---|
| ML models | scikit-learn (HistGradientBoosting / ExtraTrees / GradientBoosting regressors) |
| Feature engineering | pandas, NumPy, SciPy (rainfall trend regression, flood/heat indices) |
| Backend API | Django (function-based views, no DRF) |
| Database | SQLite |
| Frontend | React 19 + Vite |
| Map | Leaflet, plotting live dam data from a Gujarat dams dataset |
| Styling | Tailwind CSS |

## Repo Structure

```
backend/
  pulse/
    views.py            # /predict/, /dams_csv/, and form-submission endpoints
    models.py            # Contact, Feedback, LetUsKnow, Dam
  dam_scoring.py          # Heuristic scoring formulas used as ML training labels
  train_models.py         # Trains and evaluates the geological & climatic models
  geological_model.pkl    # Trained model + feature list + scaler
  climatic_model.pkl
  model_metrics.json       # Train/test R² and MSE for both models
  Dams_Gujarat.csv         # Source dam dataset for Gujarat
frontend/
  src/
    components/GujaratMap.jsx   # Interactive Leaflet map of dam sites
    components/MapSection.jsx
    pages/Index.jsx              # Suitability prediction UI
    pages/Contact.jsx, Services.jsx, LetUsKnow.jsx
Planet Pulse.pdf            # Project report / write-up
```

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

Runs on `http://localhost:8000`. Trained model files (`geological_model.pkl`, `climatic_model.pkl`) are already included — to retrain from scratch, run `python train_models.py`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on the Vite dev server and calls the backend at `http://localhost:8000`.

## API

**`POST /api/predict/`** — returns geological, climatic, and overall suitability scores for a given site's features.

**`GET /api/dams_csv/`** — returns Gujarat's dam dataset as JSON, including precomputed suitability scores, for map rendering.

**`POST /api/contact/submit/`, `/api/feedback/submit/`, `/api/letusknow/submit/`** — store form submissions and trigger acknowledgement emails.

## Known Limitations & Next Steps

- Currently scoped to Gujarat's dam network and the features present in its training CSV — not yet generalized to arbitrary geographies
- Training labels originate from a hand-tuned heuristic formula rather than ground-truth engineering assessments, so model quality is bounded by how well that heuristic reflects real-world suitability
- Frontend API URL is hardcoded to `localhost:8000` rather than environment-configured, so a production frontend build currently can't point at a deployed backend without a code change
- CORS is fully open (`CORS_ALLOW_ALL_ORIGINS = True`) and the database is SQLite — both fine for local development, but would need tightening (proper CORS allowlist, PostgreSQL) before any public deployment
- Planned: expand training data beyond Gujarat, replace the hardcoded frontend API URL with an env var, and validate the heuristic scoring formula against real geotechnical assessments where available

## License

MIT

## Author

Built by **Pal Trivedi**. Full project write-up available in `Planet Pulse.pdf`.
