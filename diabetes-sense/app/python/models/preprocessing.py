import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

def preprocess_data(file_path):
    # Import data
    data = pd.read_csv(file_path)

    # Handle missing values
    data = pd.DataFrame(SimpleImputer(strategy='mean').fit_transform(data), columns=data.columns)

    # Separate features X and target variable Y
    x = data.drop(columns=['Outcome'] + (['Case Number'] if 'Case Number' in data.columns else []))
    y = data['Outcome']

    # Standardize features
    x = StandardScaler().fit_transform(x)

    # Split the data
    return train_test_split(x, y, test_size=0.2, stratify=y, random_state=42)
