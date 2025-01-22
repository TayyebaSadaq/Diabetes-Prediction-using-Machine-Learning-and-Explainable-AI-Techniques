from flask import Flask, request, jsonify
import numpy as np
import pickle # save RF model for reuse

app = Flask(__name__)# create an instance of the Flask class

# allow requests from the REACT app
from flask_cors import CORS
CORS(app)

# load RF model
with open('app/models/random_forest.pkl', 'rb') as rb_model_file:
    rb_model = pickle.load(rb_model_file)
    
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # get data posted as JSON
    features = [
        float(data['Pregnancies']),
        float(data['Glucose']),
        float(data['BloodPressure']),
        float(data['SkinThickness']),
        float(data['Insulin']),
        float(data['BMI']),
        float(data['DiabetesPedigreeFunction']),
        float(data['Age']),
    ]
    
    # convert input to numpy array and reshape
    input_data = np.array(features).reshape(1, -1)
    prediction_rf = rb_model.predict(input_data)
    prediction_prob = rb_model.predict_proba(input_data)
    
    # Convert prediction result to native Python int for JSON serialization
    prediction_rf = int(prediction_rf[0])
    
    # Debug print statement
    print(f"Raw prediction: {prediction_rf}, Prediction probability: {prediction_prob}")
    
    # respond with result
    return jsonify({
        'Diagnosis prediction': prediction_rf,  # return the class prediction (0 or 1)
        'Prediction probability': prediction_prob[0].tolist()  # convert the probability to a list
    })



if __name__ == '__main__':
    app.run(debug=True)