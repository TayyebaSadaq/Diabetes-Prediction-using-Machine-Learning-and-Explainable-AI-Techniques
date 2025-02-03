import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import GridSearchCV

import warnings

warnings.filterwarnings("ignore")

# importing dataset
data = pd.read_csv(r"C:\Users\Tayyeba\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\data\pima.csv")

# Define features and target variable
X = data[['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']] # Features
y = data['Outcome'] # Target variable

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=42)

param_grid = {
    'n_estimators': [50, 100, 150],
    'learning_rate': [0.01, 0.1, 1],
    'max_depth': [3, 5, 7]
}

gbc = GradientBoostingClassifier()

grid_search = GridSearchCV(estimator = gbc,
                           param_grid = param_grid,
                           cv = 5,
                           scoring = 'accuracy',
                           n_jobs = -1)

grid_search.fit(X_train, y_train)

# Get the best parameters and best model
best_params = grid_search.best_params_
best_model = grid_search.best_estimator_

y_pred_best = best_model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred_best)
print(f"Accuracy: {accuracy}")
classification_rep = classification_report(y_test, y_pred_best)
print(f"Classification Report: {classification_rep}")

# sample prediction
sample = X_test.iloc[0:1]
prediction = best_model.predict(sample)
print(f"Sample Patient: {sample.to_dict()}")
print(f"Predicted Diagnosis: {'Diabetic' if prediction[0] == 1 else 'Not Diabetic'}")
