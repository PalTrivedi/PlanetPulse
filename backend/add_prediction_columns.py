import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings('ignore')

def calculate_geological_suitability_score(row):
    """
    Calculate geological suitability score based on geological factors
    Score range: 0-100 (higher is better)
    """
    score = 0
    
    # Seismic Zone (lower is better)
    seismic_zone = row['Seismic_Zone']
    if pd.notna(seismic_zone):
        if seismic_zone == 1:
            score += 25
        elif seismic_zone == 2:
            score += 20
        elif seismic_zone == 3:
            score += 15
        elif seismic_zone == 4:
            score += 10
        elif seismic_zone == 5:
            score += 5
    
    # Soil Type (Vertisols and Cambisols are generally good for dams)
    main_soil = str(row['SoilType_Main']).lower()
    secondary_soil = str(row['SoilType_Secondary']).lower()
    
    if 'vertisol' in main_soil or 'vertisol' in secondary_soil:
        score += 20
    elif 'cambisol' in main_soil or 'cambisol' in secondary_soil:
        score += 15
    elif 'luvisol' in main_soil or 'luvisol' in secondary_soil:
        score += 10
    elif 'leptosol' in main_soil or 'leptosol' in secondary_soil:
        score += 8
    elif 'arenosol' in main_soil or 'arenosol' in secondary_soil:
        score += 5
    else:
        score += 10  # Unknown soil types get moderate score
    
    # Elevation (moderate elevation is good)
    elevation = row['Elevation']
    if pd.notna(elevation):
        if 50 <= elevation <= 200:
            score += 15
        elif 20 <= elevation < 50 or 200 < elevation <= 300:
            score += 12
        elif elevation < 20 or elevation > 300:
            score += 8
    
    # Slope (lower slope is better for dam construction)
    slope = row['Slope(%)']
    if pd.notna(slope):
        if slope <= 2:
            score += 15
        elif 2 < slope <= 5:
            score += 12
        elif 5 < slope <= 10:
            score += 8
        elif slope > 10:
            score += 5
    
    # Max Height (moderate height is good)
    max_height = row['Max Height above Foundation (m)']
    if pd.notna(max_height):
        if 10 <= max_height <= 30:
            score += 10
        elif 5 <= max_height < 10 or 30 < max_height <= 50:
            score += 8
        elif max_height < 5 or max_height > 50:
            score += 5
    
    return min(score, 100)  # Cap at 100

def calculate_climatic_effect_score(row):
    """
    Calculate climatic effect score based on rainfall and climate data
    Score range: 0-100 (higher is better for dam sustainability)
    """
    score = 0
    
    # 5-year rainfall average (moderate rainfall is good)
    rainfall_5yr = row['Rainfall_5yr_Avg']
    if pd.notna(rainfall_5yr):
        if 800 <= rainfall_5yr <= 1200:
            score += 25
        elif 600 <= rainfall_5yr < 800 or 1200 < rainfall_5yr <= 1500:
            score += 20
        elif 400 <= rainfall_5yr < 600 or 1500 < rainfall_5yr <= 1800:
            score += 15
        elif rainfall_5yr < 400 or rainfall_5yr > 1800:
            score += 10
    
    # Monsoon intensity average
    monsoon_intensity = row['MonsoonIntensityAvg(mm/wet_day)']
    if pd.notna(monsoon_intensity):
        if 15 <= monsoon_intensity <= 20:
            score += 20
        elif 10 <= monsoon_intensity < 15 or 20 < monsoon_intensity <= 25:
            score += 15
        elif 5 <= monsoon_intensity < 10 or 25 < monsoon_intensity <= 30:
            score += 10
        elif monsoon_intensity < 5 or monsoon_intensity > 30:
            score += 5
    
    # Rainfall consistency (calculate coefficient of variation)
    rainfall_years = [
        row['Rainfall_2020'], row['Rainfall_2021'], 
        row['Rainfall_2022'], row['Rainfall_2023'], row['Rainfall_2024']
    ]
    rainfall_years = [r for r in rainfall_years if pd.notna(r)]
    
    if len(rainfall_years) >= 3:
        mean_rainfall = np.mean(rainfall_years)
        std_rainfall = np.std(rainfall_years)
        if mean_rainfall > 0:
            cv = std_rainfall / mean_rainfall
            if cv <= 0.2:  # Low variability
                score += 20
            elif 0.2 < cv <= 0.3:
                score += 15
            elif 0.3 < cv <= 0.4:
                score += 10
            else:
                score += 5
    
    # NDVI (vegetation index - higher is better)
    ndvi = row['Avg_NDVI_Last5Years']
    if pd.notna(ndvi):
        if 0.3 <= ndvi <= 0.6:
            score += 15
        elif 0.1 <= ndvi < 0.3 or 0.6 < ndvi <= 0.8:
            score += 10
        elif ndvi < 0.1 or ndvi > 0.8:
            score += 5
    
    # River flow rate (moderate flow is good)
    river_flow = row['RiverFlowRate(m/day)']
    if pd.notna(river_flow):
        if 0.0001 <= river_flow <= 0.001:
            score += 10
        elif 0.00001 <= river_flow < 0.0001 or 0.001 < river_flow <= 0.01:
            score += 8
        elif river_flow < 0.00001 or river_flow > 0.01:
            score += 5
    
    # River distance (closer is better)
    river_distance = row['RiverDistance(km)']
    if pd.notna(river_distance):
        if river_distance <= 50:
            score += 10
        elif 50 < river_distance <= 100:
            score += 8
        elif 100 < river_distance <= 200:
            score += 5
        elif river_distance > 200:
            score += 3
    
    return min(score, 100)  # Cap at 100

def main():
    # Read the CSV file
    print("Reading CSV file...")
    df = pd.read_csv('frontend/public/Dams_Gujarat.csv')
    
    print(f"Original dataset shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    
    # Calculate geological suitability scores
    print("Calculating geological suitability scores...")
    df['Geological_Suitability_Score'] = df.apply(calculate_geological_suitability_score, axis=1)
    
    # Calculate climatic effect scores
    print("Calculating climatic effect scores...")
    df['Climatic_Effect_Score'] = df.apply(calculate_climatic_effect_score, axis=1)
    
    # Add overall suitability score (weighted average)
    df['Overall_Suitability_Score'] = (
        df['Geological_Suitability_Score'] * 0.6 + 
        df['Climatic_Effect_Score'] * 0.4
    ).round(1)
    
    # Add suitability categories
    def get_suitability_category(score):
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
    
    df['Geological_Suitability_Category'] = df['Geological_Suitability_Score'].apply(get_suitability_category)
    df['Climatic_Effect_Category'] = df['Climatic_Effect_Score'].apply(get_suitability_category)
    df['Overall_Suitability_Category'] = df['Overall_Suitability_Score'].apply(get_suitability_category)
    
    # Save the updated CSV
    output_file = 'frontend/public/Dams_Gujarat_with_Predictions.csv'
    df.to_csv(output_file, index=False)
    
    print(f"\nUpdated dataset saved to: {output_file}")
    print(f"New dataset shape: {df.shape}")
    
    # Print summary statistics
    print("\n=== SUMMARY STATISTICS ===")
    print(f"Geological Suitability Score:")
    print(f"  Mean: {df['Geological_Suitability_Score'].mean():.1f}")
    print(f"  Std: {df['Geological_Suitability_Score'].std():.1f}")
    print(f"  Min: {df['Geological_Suitability_Score'].min():.1f}")
    print(f"  Max: {df['Geological_Suitability_Score'].max():.1f}")
    
    print(f"\nClimatic Effect Score:")
    print(f"  Mean: {df['Climatic_Effect_Score'].mean():.1f}")
    print(f"  Std: {df['Climatic_Effect_Score'].std():.1f}")
    print(f"  Min: {df['Climatic_Effect_Score'].min():.1f}")
    print(f"  Max: {df['Climatic_Effect_Score'].max():.1f}")
    
    print(f"\nOverall Suitability Score:")
    print(f"  Mean: {df['Overall_Suitability_Score'].mean():.1f}")
    print(f"  Std: {df['Overall_Suitability_Score'].std():.1f}")
    print(f"  Min: {df['Overall_Suitability_Score'].min():.1f}")
    print(f"  Max: {df['Overall_Suitability_Score'].max():.1f}")
    
    # Print category distributions
    print(f"\n=== CATEGORY DISTRIBUTIONS ===")
    print("Geological Suitability Categories:")
    print(df['Geological_Suitability_Category'].value_counts())
    
    print(f"\nClimatic Effect Categories:")
    print(df['Climatic_Effect_Category'].value_counts())
    
    print(f"\nOverall Suitability Categories:")
    print(df['Overall_Suitability_Category'].value_counts())
    
    # Show top 10 dams by overall suitability
    print(f"\n=== TOP 10 DAMS BY OVERALL SUITABILITY ===")
    top_dams = df.nlargest(10, 'Overall_Suitability_Score')[
        ['Name', 'District', 'Geological_Suitability_Score', 'Climatic_Effect_Score', 'Overall_Suitability_Score', 'Overall_Suitability_Category']
    ]
    print(top_dams.to_string(index=False))

if __name__ == "__main__":
    main() 