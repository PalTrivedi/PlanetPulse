import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score

def load_and_preprocess_data(filepath):
    """Load and preprocess the dataset."""
    print("Loading and preprocessing data...")
    df = pd.read_csv(filepath)
    
    # Encode categorical features
    categorical_cols = ['SoilType_Main', 'SoilType_Secondary', 'Type']
    for col in categorical_cols:
        df[col] = df[col].astype(str)
        df[col] = LabelEncoder().fit_transform(df[col])
    
    return df

def train_geological_model(X, y):
    """Train the geological suitability model."""
    print("\nTraining Geological Suitability Model...")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Create and train pipeline
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('model', RandomForestRegressor(n_estimators=200, random_state=42))
    ])
    
    pipeline.fit(X_train, y_train)
    
    # Evaluate
    y_pred = pipeline.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Geological Model - MSE: {mse:.4f}, R2 Score: {r2:.4f}")
    return pipeline

def train_climatic_model(X, y):
    """Train the climatic effect model."""
    print("\nTraining Climatic Effect Model...")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Create and train pipeline
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('model', RandomForestRegressor(n_estimators=200, random_state=42))
    ])
    
    pipeline.fit(X_train, y_train)
    
    # Evaluate
    y_pred = pipeline.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Climatic Model - MSE: {mse:.4f}, R2 Score: {r2:.4f}")
    return pipeline

def save_model(model, filepath):
    """Save model using joblib."""
    joblib.dump(model, filepath)
    print(f"Model saved to {filepath}")

def load_model(filepath):
    """Load model using joblib."""
    model = joblib.load(filepath)
    print(f"Model loaded from {filepath}")
    return model

def main():
    # File paths
    input_file = 'Dams_Gujarat.csv'
    geo_model_path = 'geological_model.pkl'
    clim_model_path = 'climatic_model.pkl'
    
    try:
        # Load and preprocess data
        df = load_and_preprocess_data(input_file)
        
        # Define features for each model
        geo_features = [
            'Latitude', 'Longitude', 'Elevation', 'Slope(%)', 'SoilType_Main',
            'SoilType_Secondary', 'Seismic_Zone', 'Type', 'Length (m)',
            'Max Height above Foundation (m)', 'RiverDistance(km)', 'RiverFlowRate(m/day)'
        ]
        
        climatic_features = [
            'Rainfall_2020', 'Rainfall_2021', 'Rainfall_2022', 'Rainfall_2023', 'Rainfall_2024',
            'Rainfall_5yr_Avg', 'Rainfall_StdDev_5yr', 'Max_Annual_Rainfall', 'Min_Annual_Rainfall',
            'MonsoonIntensityAvg(mm/wet_day)', 'Extreme_Rainfall_Days', 'Flood_Risk_Index',
            'Cyclone_Exposure', 'Avg_Temperature_5yr', 'Max_Temperature_Last5yr',
            'Temperature_StdDev_5yr', 'Heatwave_Days_PerYear', 'ENSO_Impact_Index',
            'Climate_Vulnerability_Index', 'NDVI_2025(avg)'
        ]
        
        # Train geological model
        X_geo = df[geo_features]
        y_geo = df['Geological_Suitability_Score']
        geo_model = train_geological_model(X_geo, y_geo)
        
        # Train climatic model
        X_clim = df[climatic_features]
        y_clim = df['Climatic_Effect_Score']
        clim_model = train_climatic_model(X_clim, y_clim)
        
        # Save models
        save_model(geo_model, geo_model_path)
        save_model(clim_model, clim_model_path)
        
        print("\n✅ Training complete! Models saved successfully.")
        
        # Example load (optional)
        # loaded_geo_model = load_model(geo_model_path)
        # loaded_clim_model = load_model(clim_model_path)
        
    except FileNotFoundError:
        print(f"Error: Could not find the input file '{input_file}'.")
        print("Please make sure the file exists in the current directory.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()
