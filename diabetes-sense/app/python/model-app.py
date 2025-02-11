from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from lime.lime_tabular import LimeTabularExplainer
import matplotlib.pyplot as plt
import base64
from io import BytesIO

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

# Load training data for LIME explainer
data = pd.read_csv("/home/tayyebasadaq/Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques/diabetes-sense/app/data/preprocessed_pima.csv")
X_train = data[FEATURES]

# Initialize LIME explainer
explainer = LimeTabularExplainer(X_train.values, mode="classification", feature_names=FEATURES)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        input_data = [data.get(feature, 0) for feature in FEATURES]
        input_df = pd.DataFrame([input_data], columns=FEATURES)
        
        results = {}
        
        for model_name, model in models.items():
            prediction = model.predict(input_df)[0]
            confidence = max(model.predict_proba(input_df)[0])
            result = "Diabetic" if prediction == 1 else "Not Diabetic"
            
            # Generate LIME explanation
            exp = explainer.explain_instance(input_df.values[0], model.predict_proba, num_features=8)
            lime_explanation = exp.as_list()
            
            # Generate LIME explanation visualization
            fig = exp.as_pyplot_figure()
            buf = BytesIO()
            fig.savefig(buf, format="png")
            buf.seek(0)
            img_base64 = base64.b64encode(buf.read()).decode('utf-8')
            plt.close(fig)
            
            results[model_name] = {
                "prediction": result,
                "confidence": confidence,
                "lime_explanation": lime_explanation,
                "lime_explanation_image": img_base64
            }
            
            # Log the result to the console
            print(f"Model: {model_name}, Prediction: {result}, Confidence: {confidence}")
            print(f"LIME Explanation: {lime_explanation}")
        
        return jsonify(results)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)