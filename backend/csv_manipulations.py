import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

# === Load your dataset ===
df = pd.read_csv("C:/Users/HP/Desktop/PlanetPulse/backend/Dams_Gujarat.csv")

# === Rainfall features ===
rainfall_cols = ["Rainfall_2020", "Rainfall_2021", "Rainfall_2022", "Rainfall_2023", "Rainfall_2024"]

df["Rainfall_StdDev_5yr"] = df[rainfall_cols].std(axis=1)
df["Max_Annual_Rainfall"] = df[rainfall_cols].max(axis=1)
df["Min_Annual_Rainfall"] = df[rainfall_cols].min(axis=1)

# === NDVI features ===
# If you only have Avg_NDVI_Last5Years, we need per-year NDVI columns.
# Example column names (if available): NDVI_2020, NDVI_2021, ...
ndvi_cols = [col for col in df.columns if col.startswith("NDVI_") and col != "Avg_NDVI_Last5Years"]

if ndvi_cols:
    # StdDev of NDVI across 5 years
    df["NDVI_StdDev_5yr"] = df[ndvi_cols].std(axis=1)

    # NDVI Trend (slope of linear regression)
    years = np.array(range(len(ndvi_cols))).reshape(-1, 1)  # e.g., [0,1,2,3,4]
    slopes = []
    for _, row in df[ndvi_cols].iterrows():
        y = row.values.reshape(-1, 1)
        model = LinearRegression().fit(years, y)
        slopes.append(model.coef_[0][0])
    df["NDVI_Trend_5yr"] = slopes
else:
    # If only Avg_NDVI_Last5Years is available, leave NaN for now
    df["NDVI_StdDev_5yr"] = np.nan
    df["NDVI_Trend_5yr"] = np.nan

# === Save updated dataset ===
df.to_csv("C:/Users/HP/Desktop/PlanetPulse/backend/Dams_Gujarat_updated.csv", index=False)

print("✅ New features added and dataset saved as your_dataset_updated.csv")
