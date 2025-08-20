import pandas as pd

def calculate_geological_suitability_score(row):
    score = 0
    
    # Seismic Zone
    seismic_zone = row['Seismic_Zone']
    if pd.notna(seismic_zone):
        score += {1:25, 2:20, 3:15, 4:10, 5:5}.get(seismic_zone, 10)
    
    # Soil
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
        score += 10
    
    # Elevation
    elevation = row['Elevation']
    if pd.notna(elevation):
        if 50 <= elevation <= 200: score += 15
        elif 20 <= elevation < 50 or 200 < elevation <= 300: score += 12
        else: score += 8
    
    # Slope
    slope = row['Slope(%)']
    if pd.notna(slope):
        if slope <= 2: score += 15
        elif slope <= 5: score += 12
        elif slope <= 10: score += 8
        else: score += 5
    
    # Dam height
    max_height = row['Max Height above Foundation (m)']
    if pd.notna(max_height):
        if 10 <= max_height <= 30: score += 10
        elif 5 <= max_height < 10 or 30 < max_height <= 50: score += 8
        else: score += 5
    
    return min(score, 100)

def calculate_climatic_effect_score(row):
    score = 0
    
    # 5-year avg rainfall
    rainfall_5yr = row['Rainfall_5yr_Avg']
    if pd.notna(rainfall_5yr):
        if 800 <= rainfall_5yr <= 1200: score += 25
        elif 600 <= rainfall_5yr <= 1500: score += 20
        elif 400 <= rainfall_5yr <= 1800: score += 15
        else: score += 10
    
    # Monsoon intensity
    monsoon_intensity = row['MonsoonIntensityAvg(mm/wet_day)']
    if pd.notna(monsoon_intensity):
        if 15 <= monsoon_intensity <= 20: score += 20
        elif 10 <= monsoon_intensity <= 25: score += 15
        elif 5 <= monsoon_intensity <= 30: score += 10
        else: score += 5
    
    # Rainfall stability (StdDev lower is better)
    std_rainfall = row['Rainfall_StdDev_5yr']
    if pd.notna(std_rainfall):
        if std_rainfall < 100: score += 15
        elif std_rainfall < 200: score += 10
        else: score += 5
    
    # NDVI (avg)
    ndvi = row['NDVI_2025(avg)']
    if pd.notna(ndvi):
        if 0.3 <= ndvi <= 0.6: score += 15
        elif 0.1 <= ndvi <= 0.8: score += 10
        else: score += 5
    
    # Temperature stability
    temp_std = row['Temperature_StdDev_5yr']
    if pd.notna(temp_std):
        if temp_std < 2: score += 10
        elif temp_std < 4: score += 8
        else: score += 5
    
    # Heatwave days
    heatwave = row['Heatwave_Days_PerYear']
    if pd.notna(heatwave):
        if heatwave < 5: score += 10
        elif heatwave < 10: score += 7
        else: score += 5
    
    # Flood risk
    flood_risk = row['Flood_Risk_Index']
    if pd.notna(flood_risk):
        if flood_risk < 0.3: score += 10
        elif flood_risk < 0.6: score += 7
        else: score += 5
    
    # Cyclone exposure
    cyclone = row['Cyclone_Exposure']
    if pd.notna(cyclone):
        if cyclone == 0: score += 5
        elif cyclone == 1: score += 3
        else: score += 2
    
    return min(score, 100)

def calculate_overall_suitability_score(row):
    return round(row['Geological_Suitability_Score'] * 0.6 +
                row['Climatic_Effect_Score'] * 0.4, 1)

def get_category(score):
    if score >= 80: return "Excellent"
    elif score >= 70: return "Good"
    elif score >= 60: return "Moderate"
    elif score >= 50: return "Fair"
    else: return "Poor"

def process_dam_data(df):
    """
    Process dam data by calculating scores and categories.
    
    Args:
        df (DataFrame): Input dataframe containing dam data
        
    Returns:
        DataFrame: Processed dataframe with additional score and category columns
    """
    # Calculate scores
    df['Geological_Suitability_Score'] = df.apply(calculate_geological_suitability_score, axis=1)
    df['Climatic_Effect_Score'] = df.apply(calculate_climatic_effect_score, axis=1)
    df['Overall_Suitability_Score'] = df.apply(calculate_overall_suitability_score, axis=1)
    
    # Add categories
    df['Geological_Category'] = df['Geological_Suitability_Score'].apply(get_category)
    df['Climatic_Category'] = df['Climatic_Effect_Score'].apply(get_category)
    df['Overall_Category'] = df['Overall_Suitability_Score'].apply(get_category)
    
    return df

# Example usage:
if __name__ == "__main__":
    # Load your data
    # df = pd.read_csv('Dams_Gujarat.csv')
    
    # Process the data
    # processed_df = process_dam_data(df)
    
    # Save the results
    # processed_df.to_csv('Dams_Gujarat_Scored.csv', index=False)
    print("Dam scoring module loaded. Use process_dam_data() to process your dataframe.")
