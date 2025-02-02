import joblib
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import GridSearchCV
from models.preprocessing import preprocess_data

# Train Gradient Boosting model and save it
def train_gbm_model():
    x_train, x_test, y_train, y_test = preprocess_data('app/data/pima-indians-diabetes.csv')
    param_grid = {
        'n_estimators': [50, 100, 200],
        'learning_rate': [0.01, 0.1, 0.2],
        'max_depth': [3, 5, 7],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4],
    }
    model = GridSearchCV(GradientBoostingClassifier(random_state=42), param_grid, cv=5).fit(x_train, y_train)
    joblib.dump(model, 'app/model/gbm_classifier.pkl')
    print("Gradient Boosting model trained and saved!")

# Predict using the trained model
def predict_gbm(input_data):
    model = joblib.load('app/model/gbm_classifier.pkl')
    features = pd.DataFrame([input_data], columns=[
        'Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 
        'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'
    ])
    prediction = model.predict(features)
    probability = model.predict_proba(features)
    return prediction, probability

# Trigger training when script runs
if __name__ == '__main__':
    train_gbm_model()
