import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.impute import SimpleImputer
import matplotlib.pyplot as plt
import seaborn as sns
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from pathlib import Path

app = Flask(__name__)
CORS(app)

''' IMPORTING DATA '''
data = pd.read_csv('app/data/pima-indians-diabetes.csv')

''' HANDLE MISSING VALUES '''
imputer = SimpleImputer(strategy='mean')
data = pd.DataFrame(imputer.fit_transform(data), columns=data.columns)

''' SEPARATE FEATURES X AND TARGET VARIABLES Y'''
# Ensure 'Case Number' exists before dropping it
columns_to_drop = ['Outcome']  # Always drop the 'Outcome' column
if 'Case Number' in data.columns:
    columns_to_drop.append('Case Number')

# Drop columns safely
x = data.drop(columns=columns_to_drop, axis=1)
y = data['Outcome']

''' STANDARDISE THE FEATURES '''
scaler = StandardScaler()
x = scaler.fit_transform(x)

''' SPLITTING THE DATA '''
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, stratify=y, random_state=42)

''' DEFINE PARAMETER GRID FOR GRID SEARCH '''
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 10, 20],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
}

''' TRAIN RF CLASSIFIER USING GRID SEARCH FOR HYPERPARAMETER TUNING'''
rf_classifier = GridSearchCV(RandomForestClassifier(random_state=42), param_grid, cv=5, refit=True, verbose=0)
rf_classifier.fit(x_train, y_train)

''' CREATE MODEL DIRECTORY IF IT DOESN'T EXIST '''
model_dir = Path('app/model')
model_dir.mkdir(parents=True, exist_ok=True)

''' SAVE THE TRAINED MODEL AND SCALER '''
joblib.dump(rf_classifier, model_dir / 'rf_classifier.pkl')
joblib.dump(scaler, model_dir / 'scaler.pkl')

''' LOAD TRAINED MODEL AND SCALER '''
model = joblib.load(model_dir / 'rf_classifier.pkl')
scaler = joblib.load(model_dir / 'scaler.pkl')

''' API ROUTE TO HANDLE PREDICTIONS '''
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse JSON input
        input_data = request.json
        
        # Extract feature values from input
        features = [
            input_data['Pregnancies'], 
            input_data['Glucose'], 
            input_data['BloodPressure'], 
            input_data['SkinThickness'], 
            input_data['Insulin'], 
            input_data['BMI'], 
            input_data['DiabetesPedigreeFunction'], 
            input_data['Age']
        ]
        
        # Define the feature names as per your training data
        feature_names = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']
        
        # Convert the list of features into a DataFrame with correct feature names
        features_df = pd.DataFrame([features], columns=feature_names)
        
        # Standardize the input features
        standardized_features = scaler.transform(features_df)
        
        # Get predictions and probabilities
        probability = model.predict_proba(standardized_features)[0][1]
        prediction = model.predict(standardized_features)[0]
        
        # Determine risk level based on probability (remove 'Medium Risk')
        if probability < 0.50:
            risk_level = 'Low Risk'
        else:
            risk_level = 'High Risk'
        
        # Response
        response = {
            'Prediction': 'GDM' if prediction == 1 else 'Non GDM',
            'Probability': round(probability, 2),
            'Risk Level': risk_level
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 400



if __name__ == '__main__':
    app.run(debug=True)
