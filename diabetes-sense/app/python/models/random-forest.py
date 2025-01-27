from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV
from preprocessing import preprocess_data


# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Preprocess data and train model
x_train, x_test, y_train, y_test = preprocess_data('app/data/pima-indians-diabetes.csv')
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 10, 20],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
}
model = GridSearchCV(RandomForestClassifier(random_state=42), param_grid, cv=5).fit(x_train, y_train)
joblib.dump(model, 'app/model/rf_classifier')

# Prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        model = joblib.load('app/model/rf_classifier')
        input_data = request.json
        features = pd.DataFrame([[
            input_data[k] for k in ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']
        ]], columns=['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'])
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0][1]
        return jsonify({
            'Prediction': 'GDM' if prediction == 1 else 'Non GDM',
            'Probability': round(probability, 2),
            'Risk Level': 'High Risk' if probability >= 0.5 else 'Low Risk'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
