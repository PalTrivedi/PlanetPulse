import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score
import pickle
import warnings
warnings.filterwarnings('ignore')

def prepare_data():
    """Load and prepare data for training"""
    df = pd.read_csv('Dams_Gujarat.csv')
    
    # Create feature columns for geological suitability (using actual CSV column names)
    geo_features = [
        'Seismic_Zone', 'Elevation', 'Slope(%)', 'SoilType_Main', 'SoilType_Secondary',
        'Length (m)', 'Max Height above Foundation (m)'
    ]
    
    # Create feature columns for climatic effects (using only available columns)
    climate_features = [
        'Rainfall_2020', 'Rainfall_2021', 'Rainfall_2022', 'Rainfall_2023', 'Rainfall_2024',
        'Rainfall_5yr_Avg', 'MonsoonIntensityAvg(mm/wet_day)'
    ]
    
    # Prepare geological data
    geo_df = df[geo_features + ['Geological_Suitability_Score']].copy()
    geo_df = geo_df.dropna()
    
    # Prepare climate data
    climate_df = df[climate_features + ['Climatic_Effect_Score']].copy()
    climate_df = climate_df.dropna()
    
    return geo_df, climate_df

def encode_categorical_features(df, categorical_columns):
    """Encode categorical features"""
    df_encoded = df.copy()
    label_encoders = {}
    
    for col in categorical_columns:
        if col in df_encoded.columns:
            le = LabelEncoder()
            df_encoded[col] = le.fit_transform(df_encoded[col].astype(str))
            label_encoders[col] = le
    
    return df_encoded, label_encoders

def train_geological_model(geo_df):
    """Train geological suitability prediction model"""
    print("Training Geological Suitability Model...")
    
    # Encode categorical features
    categorical_cols = ['SoilType_Main', 'SoilType_Secondary']
    geo_encoded, geo_encoders = encode_categorical_features(geo_df, categorical_cols)
    
    # Prepare features and target
    geo_features = [col for col in geo_encoded.columns if col != 'Geological_Suitability_Score']
    X = geo_encoded[geo_features]
    y = geo_encoded['Geological_Suitability_Score']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_scaled)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Geological Model - MSE: {mse:.2f}, R²: {r2:.3f}")
    
    # Save model and encoders
    model_data = {
        'model': model,
        'scaler': scaler,
        'label_encoders': geo_encoders,
        'feature_names': geo_features
    }
    
    with open('geological_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print("Geological model saved as 'geological_model.pkl'")
    return model_data

def train_climate_model(climate_df):
    """Train climatic effects prediction model"""
    print("Training Climatic Effects Model...")
    
    # Prepare features and target
    climate_features = [col for col in climate_df.columns if col != 'Climatic_Effect_Score']
    X = climate_df[climate_features]
    y = climate_df['Climatic_Effect_Score']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_scaled)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Climate Model - MSE: {mse:.2f}, R²: {r2:.3f}")
    
    # Save model and scaler
    model_data = {
        'model': model,
        'scaler': scaler,
        'feature_names': climate_features
    }
    
    with open('climate_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print("Climate model saved as 'climate_model.pkl'")
    return model_data

def main():
    """Main function to train both models"""
    print("Loading data...")
    geo_df, climate_df = prepare_data()
    
    print(f"Geological data shape: {geo_df.shape}")
    print(f"Climate data shape: {climate_df.shape}")
    
    # Train geological model
    geo_model = train_geological_model(geo_df)
    
    # Train climate model
    climate_model = train_climate_model(climate_df)
    
    print("\n✅ Both models trained and saved successfully!")
    print("Files created:")
    print("- geological_model.pkl")
    print("- climate_model.pkl")

if __name__ == "__main__":
    main() 