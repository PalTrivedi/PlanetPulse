import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score
import pickle
import warnings
from scipy import stats
warnings.filterwarnings('ignore')

# Set random seed for reproducibility
np.random.seed(42)

def prepare_data():
    """Load and prepare data for training"""
    # Load the dataset with updated river data
    df = pd.read_csv('Dams_Gujarat_climate_filled_updated.csv')
    
    # Convert river distance to numeric, handle any non-numeric values
    df['RiverDistance(km)'] = pd.to_numeric(df['RiverDistance(km)'], errors='coerce')
    df['RiverFlowRate(m/day)'] = pd.to_numeric(df['RiverFlowRate(m/day)'], errors='coerce')
    
    # Create feature columns for geological suitability
    geo_features = [
        'Seismic_Zone', 'Elevation', 'Slope(%)', 'SoilType_Main', 'SoilType_Secondary',
        'Length (m)', 'Max Height above Foundation (m)'
    ]
    
    # Base climate features from the dataset
    base_climate_features = [
        'Rainfall_2020', 'Rainfall_2021', 'Rainfall_2022', 'Rainfall_2023', 'Rainfall_2024',
        'Rainfall_5yr_Avg', 'MonsoonIntensityAvg(mm/wet_day)',
        'RiverFlowRate(m/day)', 'RiverDistance(km)',
        'Rainfall_StdDev_5yr', 'Max_Annual_Rainfall', 'Min_Annual_Rainfall',
        'Avg_Temperature_5yr', 'Temperature_StdDev_5yr', 'Heatwave_Days_PerYear',
        'Flood_Risk_Index', 'Climate_Vulnerability_Index', 'Extreme_Rainfall_Days'
    ]
    
    # Filter out columns that might not exist in the dataset
    available_columns = set(df.columns)
    base_climate_features = [col for col in base_climate_features if col in available_columns]
    
    # 1. Handle rainfall data
    rainfall_cols = [f'Rainfall_{year}' for year in range(2020, 2025) if f'Rainfall_{year}' in df.columns]
    if len(rainfall_cols) >= 2:
        # Calculate statistics from annual rainfall data
        df['Rainfall_Mean'] = df[rainfall_cols].mean(axis=1)
        df['Rainfall_StdDev'] = df[rainfall_cols].std(axis=1)
        df['Rainfall_Range'] = df[rainfall_cols].max(axis=1) - df[rainfall_cols].min(axis=1)
        
        # Add trend using linear regression
        def calculate_trend(row):
            try:
                y = row[rainfall_cols].values.astype(float)
                if len(y) < 2 or np.all(y == y[0]):  # Not enough points or all values are the same
                    return 0.0
                x = np.arange(len(y))
                # Ensure we have valid numeric values
                mask = ~np.isnan(y) & ~np.isinf(y)
                if np.sum(mask) < 2:  # Need at least 2 valid points
                    return 0.0
                x = x[mask]
                y = y[mask]
                slope, _, _, _, _ = stats.linregress(x, y)
                return float(slope) if not np.isnan(slope) else 0.0
            except:
                return 0.0  # Return 0 for any calculation errors
            
        df['Rainfall_Trend'] = df.apply(calculate_trend, axis=1)
        
        base_climate_features.extend(['Rainfall_Mean', 'Rainfall_StdDev', 'Rainfall_Range', 'Rainfall_Trend'])
    
    # 2. River features
    if 'RiverFlowRate(m/day)' in df.columns and 'RiverDistance(km)' in df.columns:
        # Impute missing river flow rates with median
        river_flow_median = df['RiverFlowRate(m/day)'].median()
        df['RiverFlowRate(m/day)'] = df['RiverFlowRate(m/day)'].fillna(river_flow_median)
        
        # Create interaction features
        if 'Rainfall_5yr_Avg' in df.columns:
            df['Flow_Rainfall_Ratio'] = df['RiverFlowRate(m/day)'] / (df['Rainfall_5yr_Avg'] + 1e-6)
            base_climate_features.append('Flow_Rainfall_Ratio')
            
            # Create a combined river impact score
            df['River_Impact_Score'] = (df['RiverFlowRate(m/day)'] / df['RiverDistance(km)']).replace([np.inf, -np.inf], np.nan)
            df['River_Impact_Score'] = df['River_Impact_Score'].fillna(df['River_Impact_Score'].median())
            base_climate_features.append('River_Impact_Score')
    
    # 3. Temperature features
    if 'Avg_Temperature_5yr' in df.columns:
        # Create temperature-based features
        df['Temp_Anomaly'] = df['Avg_Temperature_5yr'] - df['Avg_Temperature_5yr'].mean()
        base_climate_features.append('Temp_Anomaly')
        
        if 'Heatwave_Days_PerYear' in df.columns:
            df['Heat_Stress_Index'] = df['Heatwave_Days_PerYear'] * (df['Avg_Temperature_5yr'] / 30.0)
            base_climate_features.append('Heat_Stress_Index')
    
    # 4. Flood risk features
    if 'Flood_Risk_Index' in df.columns and 'Rainfall_5yr_Avg' in df.columns:
        df['Flood_Risk_Adjusted'] = df['Flood_Risk_Index'] * (df['Rainfall_5yr_Avg'] / 1000)
        base_climate_features.append('Flood_Risk_Adjusted')
    
    # 5. Climate vulnerability features
    if 'Climate_Vulnerability_Index' in df.columns and 'Extreme_Rainfall_Days' in df.columns:
        df['Climate_Risk_Score'] = df['Climate_Vulnerability_Index'] * (1 + df['Extreme_Rainfall_Days'] / 100)
        base_climate_features.append('Climate_Risk_Score')
    
    # Ensure all features are numeric and handle any remaining missing values
    for col in base_climate_features:
        if col in df.columns:
            # Convert to numeric, coercing errors to NaN
            df[col] = pd.to_numeric(df[col], errors='coerce')
            # Fill any remaining NaNs with column median
            df[col] = df[col].fillna(df[col].median())
    
    # Prepare climate data - ensure we only keep rows where target variable exists
    climate_df = df[base_climate_features + ['Climatic_Effect_Score']].copy()
    climate_df = climate_df.dropna(subset=['Climatic_Effect_Score'] + base_climate_features)
    
    # Prepare geological data
    geo_df = df[geo_features + ['Geological_Suitability_Score']].copy()
    geo_df = geo_df.dropna(subset=geo_features + ['Geological_Suitability_Score'])
    
    print(f"Final climate features: {len(base_climate_features)}")
    print(f"Climate data shape after cleaning: {climate_df.shape}")
    print(f"Geological data shape after cleaning: {geo_df.shape}")
    
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
        'feature_names': geo_features,
        'X_test': X_test,
        'y_test': y_test
    }
    
    with open('geological_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print("Geological model saved as 'geological_model.pkl'")
    return model_data

def train_climate_model(df):
    """Train an enhanced climate effects model using RandomForestRegressor"""
    print("Training Enhanced Climate Effects Model...")
    
    # Encode categorical features if any exist
    categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
    if categorical_cols:
        df_encoded = encode_categorical_features(df, categorical_cols)[0]
    else:
        df_encoded = df.copy()
    
    # Prepare features and target
    X = df_encoded.drop('Climatic_Effect_Score', axis=1)
    y = df_encoded['Climatic_Effect_Score']
    
    # Check if we have enough samples
    if len(X) < 10:
        raise ValueError(f"Insufficient samples for training: {len(X)}. Need at least 10 samples.")
    
    # Split data with stratification if possible
    try:
        # Create bins for stratification
        y_bins = pd.qcut(y, q=5, duplicates='drop')
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y_bins
        )
    except Exception as e:
        print(f"Could not stratify: {str(e)}. Using random split.")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
    
    # Standardize features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Feature selection with Random Forest importance
    print("\nFeature Importance Analysis:")
    feature_selector = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    feature_selector.fit(X_train_scaled, y_train)
    
    # Get feature importances
    importances = feature_selector.feature_importances_
    indices = np.argsort(importances)[::-1]
    
    # Print feature ranking
    print("\nFeature ranking:")
    for f in range(min(20, X.shape[1])):  # Show top 20 features
        print(f"{f + 1}. {X.columns[indices[f]]}: {importances[indices[f]]:.4f}")
    
    # Train final model with optimized hyperparameters
    model = RandomForestRegressor(
        n_estimators=500,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        max_features='sqrt',
        bootstrap=True,
        random_state=42,
        n_jobs=-1,
        verbose=1
    )
    
    print("\nTraining final model...")
    model.fit(X_train_scaled, y_train)
    
    # Make predictions
    y_train_pred = model.predict(X_train_scaled)
    y_test_pred = model.predict(X_test_scaled)
    
    # Calculate metrics
    train_mse = mean_squared_error(y_train, y_train_pred)
    test_mse = mean_squared_error(y_test, y_test_pred)
    train_r2 = r2_score(y_train, y_train_pred)
    test_r2 = r2_score(y_test, y_test_pred)
    
    print(f"\nTraining Set - MSE: {train_mse:.2f}, R²: {train_r2:.3f}")
    print(f"Test Set - MSE: {test_mse:.2f}, R²: {test_r2:.3f}")
    
    # Feature importance visualization
    plt.figure(figsize=(12, 8))
    importances = model.feature_importances_
    indices = np.argsort(importances)[-15:]  # Top 15 features
    plt.title('Top 15 Feature Importances')
    plt.barh(range(len(indices)), importances[indices], align='center')
    plt.yticks(range(len(indices)), [X.columns[i] for i in indices])
    plt.xlabel('Relative Importance')
    plt.tight_layout()
    plt.savefig('feature_importance.png')
    print("\nFeature importance plot saved as 'feature_importance.png'")
    
    # Save the model, scaler, and metadata
    model_data = {
        'model': model,
        'scaler': scaler,
        'feature_names': X.columns.tolist(),
        'categorical_columns': categorical_cols,
        'train_metrics': {'mse': train_mse, 'r2': train_r2},
        'test_metrics': {'mse': test_mse, 'r2': test_r2},
        'feature_importances': dict(zip(X.columns, importances)),
        'X_test': X_test,
        'y_test': y_test
    }
    
    with open('climate_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print("\nEnhanced climate model saved as 'climate_model.pkl'")
    
    return model_data
    

def main():
    """Main function to train both models"""
    try:
        print("Loading data...")
        geo_df, climate_df = prepare_data()
        
        print(f"\nGeological data shape: {geo_df.shape}")
        print(f"Climate data shape: {climate_df.shape}")
        
        # Train geological model
        print("\nTraining Geological Model...")
        geo_model = train_geological_model(geo_df)
        
        # Train climate model if we have enough data
        if len(climate_df) >= 10:
            print("\nTraining Climate Model...")
            climate_model = train_climate_model(climate_df)
            
            # Print final summary
            print("\n" + "="*50)
            print("TRAINING SUMMARY")
            print("="*50)
            print(f"Geological Model - R²: {geo_model['test_metrics']['r2']:.3f}")
            print(f"Climate Model - R²: {climate_model['test_metrics']['r2']:.3f}")
            print("\nFeature Importance for Climate Model (Top 5):")
            feature_importances = climate_model['feature_importances']
            for i, (feature, importance) in enumerate(sorted(feature_importances.items(), 
                                                           key=lambda x: x[1], 
                                                           reverse=True)[:5], 1):
                print(f"{i}. {feature}: {importance:.4f}")
            
        else:
            print("\nInsufficient climate data for training. Need at least 10 samples.")
            print(f"Current samples: {len(climate_df)}")
            
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main() 