import pandas as pd

def update_river_data():
    # Read both CSV files
    climate_df = pd.read_csv('Dams_Gujarat_climate_filled.csv')
    source_df = pd.read_csv('Dams_Gujarat_n.csv')
    
    # Ensure the Name column exists in both dataframes for merging
    if 'Name' not in climate_df.columns or 'Name' not in source_df.columns:
        print("Error: 'Name' column not found in one or both dataframes")
        return
    
    # Create a mapping of dam names to river data
    river_columns = ['NearestRiver', 'RiverDistance(km)', 'RiverFlowRate(m/day)']
    river_data = source_df[['Name'] + river_columns].drop_duplicates(subset=['Name'])
    
    # Merge the river data into the climate dataframe
    updated_df = climate_df.merge(
        river_data,
        on='Name',
        how='left',
        suffixes=('_old', '')
    )
    
    # Drop the old columns if they exist
    for col in river_columns:
        if f"{col}_old" in updated_df.columns:
            updated_df = updated_df.drop(columns=[f"{col}_old"])
    
    # Save the updated dataframe
    updated_df.to_csv('Dams_Gujarat_climate_filled_updated.csv', index=False)
    print("Updated file saved as 'Dams_Gujarat_climate_filled_updated.csv'")
    
    # Print summary of updates
    print("\nSummary of updates:")
    for col in river_columns:
        updated_count = updated_df[col].notna().sum()
        print(f"{col}: {updated_count} non-null values")

if __name__ == "__main__":
    update_river_data()
