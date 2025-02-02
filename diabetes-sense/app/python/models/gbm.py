from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.datasets import load_digits
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from lime import lime_tabular

# setting SEED for reproducibility 
SEED = 23

# importing dataset
data = pd.read_csv(r"C:\Users\Tayyeba\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\data\pima.csv")

# Define features and target variable
X = data[['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']] # Features
y = data['Outcome'] # Target variable

# splitting dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=SEED)

# instantiate GBM Classifier 
gbc = GradientBoostingClassifier(n_estimators = 300,
                                 learning_rate = 0.05,
                                 random_state = 100,
                                 max_features = 8)

# fit model to training data
gbc.fit(X_train, y_train)

# predict on test data
y_pred = gbc.predict(X_test)

# accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f"Gradient Boosting Classifier Accuracy: {accuracy:.2f}")

### LIME IMPLEMENTATION
