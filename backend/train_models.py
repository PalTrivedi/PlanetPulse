import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import HistGradientBoostingRegressor, ExtraTreesRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import TargetEncoder
from sklearn.utils.class_weight import compute_sample_weight
import pickle, json, warnings
from scipy import stats

warnings.filterwarnings('ignore')
np.random.seed(42)

# ==================================================
# Data Preparation
# ==================================================
def load_and_prepare_data(filepath):
    df = pd.read_csv(filepath)

    # Ensure numeric conversions
    num_cols = [
        'RiverDistance(km)', 'RiverFlowRate(m/day)', 'Elevation',
        'Slope(%)', 'Length (m)', 'Max Height above Foundation (m)'
    ]
    for col in num_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

    # ---------- Feature Engineering ----------
    rainfall_cols = [f'Rainfall_{year}' for year in range(2020, 2025) if f'Rainfall_{year}' in df.columns]
    if rainfall_cols:
        df['Rainfall_Mean'] = df[rainfall_cols].mean(axis=1)
        df['Rainfall_StdDev'] = df[rainfall_cols].std(axis=1)
        df['Rainfall_Range'] = df[rainfall_cols].max(axis=1) - df[rainfall_cols].min(axis=1)

        def calc_trend(row):
            y = row[rainfall_cols].values.astype(float)
            if len(y) < 2 or np.all(y == y[0]): 
                return 0.0
            x = np.arange(len(y))
            slope, _, _, _, _ = stats.linregress(x, y)
            return float(slope) if not np.isnan(slope) else 0.0
        df['Rainfall_Trend'] = df.apply(calc_trend, axis=1)

    if 'RiverFlowRate(m/day)' in df.columns and 'RiverDistance(km)' in df.columns:
        df['RiverFlowRate(m/day)'] = df['RiverFlowRate(m/day)'].fillna(df['RiverFlowRate(m/day)'].median())
        if 'Rainfall_5yr_Avg' in df.columns:
            df['Flow_Rainfall_Ratio'] = df['RiverFlowRate(m/day)'] / (df['Rainfall_5yr_Avg'] + 1e-6)
            df['River_Impact_Score'] = (df['RiverFlowRate(m/day)'] / df['RiverDistance(km)']).replace([np.inf, -np.inf], np.nan)
            df['River_Impact_Score'] = df['River_Impact_Score'].fillna(df['River_Impact_Score'].median())

    if 'Avg_Temperature_5yr' in df.columns:
        df['Temp_Anomaly'] = df['Avg_Temperature_5yr'] - df['Avg_Temperature_5yr'].mean()
        if 'Heatwave_Days_PerYear' in df.columns:
            df['Heat_Stress_Index'] = df['Heatwave_Days_PerYear'] * (df['Avg_Temperature_5yr'] / 30.0)

    if 'Flood_Risk_Index' in df.columns and 'Rainfall_5yr_Avg' in df.columns:
        df['Flood_Risk_Adjusted'] = df['Flood_Risk_Index'] * (df['Rainfall_5yr_Avg'] / 1000)

    if 'Climate_Vulnerability_Index' in df.columns and 'Extreme_Rainfall_Days' in df.columns:
        df['Climate_Risk_Score'] = df['Climate_Vulnerability_Index'] * (1 + df['Extreme_Rainfall_Days'] / 100)

    return df
    
# ==================================================
# Helpers
# ==================================================
def evaluate_model(model, X_train, y_train, X_test, y_test, label=""):
    y_train_pred = model.predict(X_train)
    y_test_pred = model.predict(X_test)
    results = {
        'train_mse': mean_squared_error(y_train, y_train_pred),
        'test_mse': mean_squared_error(y_test, y_test_pred),
        'train_r2': r2_score(y_train, y_train_pred),
        'test_r2': r2_score(y_test, y_test_pred)
    }
    print(f"\n📊 {label} Results:")
    print(f"Train MSE: {results['train_mse']:.2f}, R²: {results['train_r2']:.3f}")
    print(f"Test  MSE: {results['test_mse']:.2f}, R²: {results['test_r2']:.3f}")
    return results

# ==================================================
# Geological Model 
# ==================================================
def train_geological_model(df):
    print("\nTraining Geological Model...")
    geo_features = [
        'Latitude', 'Longitude', 'Elevation', 'Slope(%)',
        'SoilType_Main', 'SoilType_Secondary', 'Seismic_Zone', 'Type',
        'Length (m)', 'Max Height above Foundation (m)',
        'RiverDistance(km)', 'RiverFlowRate(m/day)'
    ]
    target = 'Geological_Suitability_Score'

    available = [f for f in geo_features if f in df.columns]
    geo_df = df[available + [target]].dropna()

    # Target encoding for categorical columns
    cat_cols = [c for c in ['SoilType_Main','SoilType_Secondary','Type'] if c in geo_df.columns]
    te = TargetEncoder()
    for col in cat_cols:
        geo_df[col] = te.fit_transform(geo_df[[col]], geo_df[target])

    X = geo_df.drop(target, axis=1)
    y = geo_df[target]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = HistGradientBoostingRegressor(
        max_depth=6,
        learning_rate=0.05,
        max_iter=400,
        min_samples_leaf=20,
        l2_regularization=1.0,
        early_stopping=True,
        random_state=42
    )
    model.fit(X_train, y_train)

    # Cross-validation
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring="r2")
    print(f"Cross-val R²: {cv_scores} | Mean: {np.mean(cv_scores):.3f}")

    metrics = evaluate_model(model, X_train, y_train, X_test, y_test, label="Geological")

    model_data = {
        'model': model,
        'encoder': te,
        'features': available,
        'metrics': metrics
    }
    with open('geological_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    return model_data

# ==================================================
# Climatic Model
# ==================================================
def train_climatic_model(df):
    print("\nTraining Climatic Model...")
    clim_features = [
        'Rainfall_2020','Rainfall_2021','Rainfall_2022','Rainfall_2023','Rainfall_2024',
        'Rainfall_5yr_Avg','Rainfall_StdDev_5yr','Max_Annual_Rainfall','Min_Annual_Rainfall',
        'MonsoonIntensityAvg(mm/wet_day)','Extreme_Rainfall_Days','Flood_Risk_Index',
        'Cyclone_Exposure','Avg_Temperature_5yr','Max_Temperature_Last5yr',
        'Temperature_StdDev_5yr','Heatwave_Days_PerYear','ENSO_Impact_Index',
        'Climate_Vulnerability_Index','NDVI_2025(avg)',
        'Rainfall_Mean','Rainfall_StdDev','Rainfall_Range','Rainfall_Trend',
        'Flow_Rainfall_Ratio','River_Impact_Score','Temp_Anomaly',
        'Heat_Stress_Index','Flood_Risk_Adjusted','Climate_Risk_Score'
    ]
    target = 'Climatic_Effect_Score'

    available = [f for f in clim_features if f in df.columns]
    clim_df = df[available + [target]].dropna()

    X = clim_df.drop(target, axis=1)
    y = clim_df[target]

    # Sample weights to balance underrepresented scores
    sample_weights = compute_sample_weight("balanced", y)

    X_train, X_test, y_train, y_test, sw_train, sw_test = train_test_split(
        X, y, sample_weights, test_size=0.2, random_state=42
    )

    # Regularized ExtraTrees
    model = ExtraTreesRegressor(
        n_estimators=400,
        max_depth=20,
        min_samples_split=10,
        min_samples_leaf=5,
        max_features="sqrt",
        bootstrap=True,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train, sample_weight=sw_train)

    # Cross-validation
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring="r2")
    print(f"Cross-val R²: {cv_scores} | Mean: {np.mean(cv_scores):.3f}")

    metrics = evaluate_model(model, X_train, y_train, X_test, y_test, label="Climatic")

    # Feature importance plot
    importances = model.feature_importances_
    indices = np.argsort(importances)[-15:]
    plt.figure(figsize=(10,6))
    plt.barh(range(len(indices)), importances[indices], align='center')
    plt.yticks(range(len(indices)), [X.columns[i] for i in indices])
    plt.title("Top 15 Climatic Feature Importances")
    plt.xlabel("Importance")
    plt.tight_layout()
    plt.savefig("climatic_feature_importance.png")

    pd.DataFrame({'feature': X.columns, 'importance': importances}).to_csv("climatic_feature_importance.csv", index=False)

    model_data = {
        'model': model,
        'features': available,
        'metrics': metrics,
        'feature_importances': dict(zip(X.columns, importances))
    }
    with open('climatic_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    return model_data

# ==================================================
# Main
# ==================================================
def main():
    df = load_and_prepare_data("Dams_Gujarat.csv")
    geo_model = train_geological_model(df)
    clim_model = train_climatic_model(df)

    summary = {
        "Geological": geo_model['metrics'],
        "Climatic": clim_model['metrics']
    }
    print("\n==============================")
    print(" FINAL TRAINING SUMMARY")
    print("==============================")
    print(json.dumps(summary, indent=2))
    print("==============================")

    with open("model_metrics.json", "w") as f:
        json.dump(summary, f, indent=2)

if __name__ == "__main__":
    main()
