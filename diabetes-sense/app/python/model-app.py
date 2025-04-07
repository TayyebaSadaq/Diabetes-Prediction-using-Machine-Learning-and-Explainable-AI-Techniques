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
import os
from sklearn.model_selection import GridSearchCV, cross_val_score

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define model folder path
model_folder = os.getenv('MODEL_FOLDER', os.path.join(os.path.dirname(__file__), '..', 'models'))

# Load models and accuracies
models = {}
accuracies = {}
model_names = ["logistic_regression.pkl", "random_forest.pkl", "gradient_boosting.pkl"]

for name in model_names:
    model_path = os.path.join(model_folder, name)
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
    model, accuracy = joblib.load(model_path)
    models[name.split('.')[0]] = model
    accuracies[name.split('.')[0]] = accuracy

# Load the scaler
scaler = joblib.load(os.path.join(model_folder, 'scaler.pkl'))

# Example feature list
FEATURES = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']

# Load training data for LIME explainer
data = pd.read_csv(os.path.join(os.path.dirname(__file__), '..', 'data', 'balanced_pima.csv'))  # Updated to use balanced_pima.csv
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
        
        selected_models = data.get('models', models.keys())  # Use selected models or default to all
        results = {}
        
        for model_name, model in models.items():
            if model_name not in selected_models:  # Skip models not selected
                continue

            if model_name == "random_forest":
                prediction = model.predict(input_df)[0]  # Use unscaled data for Random Forest
                confidence = max(model.predict_proba(input_df)[0])
                lime_input = input_df.values[0]  # Use unscaled data for LIME
            else:
                prediction = model.predict(input_df_scaled)[0]
                confidence = max(model.predict_proba(input_df_scaled)[0])
                lime_input = input_df_scaled[0]  # Use scaled data for LIME

            result = "Diabetic" if prediction == 1 else "Not Diabetic"

            # Generate LIME explanation
            exp = explainer.explain_instance(
                lime_input, model.predict_proba, num_features=8
            )
            lime_explanation = exp.as_list()

            # Generate LIME explanation bar chart visualization
            fig, ax = plt.subplots()
            feature_names, feature_importances = zip(*lime_explanation)
            ax.barh(feature_names, feature_importances, color='blue')
            ax.set_xlabel('Feature Importance')
            ax.set_title('LIME Explanation')
            plt.tight_layout()
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
                "lime_explanation_image": img_base64,
            }
        
        return jsonify(results)
    
    except Exception as e:
        print(f"Error in predict function: {e}")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route('/tune', methods=['POST'])
def tune_models():
    try:
        # Define hyperparameter grids for each model
        param_grids = {
            "logistic_regression": {
                "C": [0.1, 1, 10],
                "solver": ["liblinear", "lbfgs"]
            },
            "random_forest": {
                "n_estimators": [50, 100, 200],
                "max_depth": [None, 10, 20]
            },
            "gradient_boosting": {
                "learning_rate": [0.01, 0.1, 0.2],
                "n_estimators": [50, 100, 200]
            }
        }

        results = {}

        for model_name, model in models.items():
            if model_name not in param_grids:
                continue

            param_grid = param_grids[model_name]
            grid_search = GridSearchCV(model, param_grid, cv=5, scoring='accuracy')
            grid_search.fit(X_train, data['Outcome'])  # Assuming 'Outcome' is the target column

            # Perform cross-validation with the best parameters
            best_model = grid_search.best_estimator_
            cv_scores = cross_val_score(best_model, X_train, data['Outcome'], cv=5, scoring='accuracy')

            results[model_name] = {
                "best_params": grid_search.best_params_, 
                "cv_scores": cv_scores.tolist(),
                "mean_cv_score": np.mean(cv_scores)
            }

        return jsonify(results)

    except Exception as e:
        print(f"Error in tune_models function: {e}")
        return jsonify({"error": f"Model tuning failed: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)