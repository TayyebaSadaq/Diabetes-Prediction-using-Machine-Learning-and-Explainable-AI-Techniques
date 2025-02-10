from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

# Load the saved models
model_paths = {
    "logistic_regression": "/home/tayyebasadaq/Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques/diabetes-sense/app/models/logistic_regression.pkl",
    "random_forest": "/home/tayyebasadaq/Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques/diabetes-sense/app/models/random_forest.pkl",
    "gradient_boosting": "/home/tayyebasadaq/Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques/diabetes-sense/app/models/gradient_boosting.pkl",
}

models = {name: joblib.load(path) for name, path in model_paths.items()}

# Example feature list
FEATURES = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        model_name = data.get("model", "random_forest")  # Default to Random Forest
        
        if model_name not in models:
            return jsonify({"error": "Invalid model name. Choose from: logistic_regression, random_forest, gradient_boosting"}), 400
        
        input_data = [data.get(feature, 0) for feature in FEATURES]
        input_df = pd.DataFrame([input_data], columns=FEATURES)
        
        prediction = models[model_name].predict(input_df)[0]
        result = "Diabetic" if prediction == 1 else "Not Diabetic"
        
        return jsonify({"model": model_name, "prediction": result})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)