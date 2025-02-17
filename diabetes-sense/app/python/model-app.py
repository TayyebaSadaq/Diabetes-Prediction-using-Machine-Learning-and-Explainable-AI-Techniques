from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from lime.lime_tabular import LimeTabularExplainer
import matplotlib
matplotlib.use('Agg')  # Use the Agg backend for non-interactive plotting
import matplotlib.pyplot as plt
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the models and their accuracies
models = {}
accuracies = {}
model_names = ["logistic_regression.pkl", "random_forest.pkl", "gradient_boosting.pkl"]
model_folder = r"C:\Users\tayye\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\models"

for name in model_names:
    model, accuracy = joblib.load(model_folder + "\\" + name)
    models[name.split('.')[0]] = model
    accuracies[name.split('.')[0]] = accuracy

# Load the scaler
scaler = joblib.load(r"C:\Users\tayye\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\models\scaler.pkl")

# Example feature list
FEATURES = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']

# Load training data for LIME explainer
data = pd.read_pickle(r"C:\Users\tayye\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\data\preprocessed_pima.pkl")
X_train = data[FEATURES]

# Initialize LIME explainer
explainer = LimeTabularExplainer(X_train.values, mode="classification", feature_names=FEATURES)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        input_data = [data.get(feature, 0) for feature in FEATURES]
        input_df = pd.DataFrame([input_data], columns=FEATURES)
        
        # Scale the input data
        input_df_scaled = scaler.transform(input_df)
        
        results = {}
        
        for model_name, model in models.items():
            if model_name == "random_forest":
                prediction = model.predict(input_df)[0]
                confidence = max(model.predict_proba(input_df)[0])
            else:
                prediction = model.predict(input_df_scaled)[0]
                confidence = max(model.predict_proba(input_df_scaled)[0])
            
            result = "Diabetic" if prediction == 1 else "Not Diabetic"
            
            # Debugging statements
            print(f"Model: {model_name}, Prediction: {result}, Confidence: {confidence}")
            print(f"Input Data: {input_df.values[0]}")
            print(f"Scaled Input Data: {input_df_scaled[0]}")
            
            # Generate LIME explanation
            exp = explainer.explain_instance(input_df.values[0], model.predict_proba, num_features=8)
            lime_explanation = exp.as_list()
            
            # Generate LIME explanation bar chart visualization
            fig, ax = plt.subplots()
            feature_names, feature_importances = zip(*lime_explanation)
            ax.barh(feature_names, feature_importances, color='blue')
            ax.set_xlabel('Feature Importance')
            ax.set_title('LIME Explanation')
            plt.tight_layout()  # Adjust the layout to ensure labels are not cut off
            buf = BytesIO()
            fig.savefig(buf, format="png")
            buf.seek(0)
            img_base64 = base64.b64encode(buf.read()).decode('utf-8')
            plt.close(fig)
            
            results[model_name] = {
                "prediction": result,
                "confidence": confidence,
                "accuracy": accuracies[model_name],
                "lime_explanation": lime_explanation,
                "lime_explanation_image": img_base64
            }
        
        return jsonify(results)
    
    except Exception as e:
        print(f"Error in predict function: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)