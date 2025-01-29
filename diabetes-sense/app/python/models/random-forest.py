import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
from preprocessing import preprocess_data

# Preprocess data
x_train, x_test, y_train, y_test = preprocess_data('app/data/pima-indians-diabetes.csv')

# Convert to DataFrame (assuming you know the column names)
columns = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 
           'BMI', 'DiabetesPedigreeFunction', 'Age']

x_train = pd.DataFrame(x_train, columns=columns)
x_test = pd.DataFrame(x_test, columns=columns)

# Feature Engineering: Add Interaction Terms
x_train['BMI_Age'] = x_train['BMI'] * x_train['Age']
x_test['BMI_Age'] = x_test['BMI'] * x_test['Age']
x_train['Glucose_Insulin'] = x_train['Glucose'] * (x_train['Insulin'] + 1)
x_test['Glucose_Insulin'] = x_test['Glucose'] * (x_test['Insulin'] + 1)

# Feature Scaling
scaler = StandardScaler()
x_train = scaler.fit_transform(x_train)
x_test = scaler.transform(x_test)

# Save the scaler for future use
joblib.dump(scaler, 'app/model/scaler.pkl')

# Adjusted class weights to prioritize class 1
class_weights = {0: 1, 1: 3}

# Optimized parameter grid
param_grid = {
    'n_estimators': [300, 500],
    'max_depth': [15, 20],
    'min_samples_split': [5, 10],
    'min_samples_leaf': [1, 2],
    'max_features': ['sqrt'],
    'class_weight': [class_weights]
}

# Stratified 10-Fold Cross-Validation
cv = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)

# Train with GridSearchCV
model = GridSearchCV(RandomForestClassifier(random_state=42), param_grid, cv=cv, n_jobs=-1, verbose=2)
model.fit(x_train, y_train)

# Save the best model
joblib.dump(model.best_estimator_, 'app/model/rf_classifier')

# Get probability-based predictions
y_proba = model.best_estimator_.predict_proba(x_test)
threshold = 0.40  # Lower threshold to improve recall
y_pred = (y_proba[:, 1] >= threshold).astype(int)

# Evaluate the model
print("Classification Report:\n", classification_report(y_test, y_pred))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))

print("🔥 Model trained and saved successfully!")
