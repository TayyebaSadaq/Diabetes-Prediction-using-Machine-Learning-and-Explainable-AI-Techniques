import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn import metrics
from sklearn.linear_model import LogisticRegression

import warnings
warnings.filterwarnings('ignore')

data = pd.read_csv(r"C:\Users\Tayyeba\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\data\pima.csv")

# Define features and target variable
X = data[['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']] # Features
y = data['Outcome'] # Target variable

# Splitting the data into training and testing sets (70% training, 30% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Creating the Logistic Regression classifier
log_reg = LogisticRegression()

# Fit the classifier to the training data
log_reg.fit(X_train, y_train)

# Make predictions
y_pred = log_reg.predict(X_test)

# Calculate accuracy and classification report
accuracy = metrics.accuracy_score(y_test, y_pred)
classification_rep = metrics.classification_report(y_test, y_pred)

# Print results
print(f"Accuracy: {accuracy:.2f}")
print("\nClassification Report:\n", classification_rep)

# Sample prediction
sample = X_test.iloc[0:1] # Keep as DataFrame to match model input format
prediction = log_reg.predict(sample)

# Retrieve and display sample
sample_dict = sample.iloc[0].to_dict()
print(f"\n\nSample Patient: {sample_dict}")
print(f"Predicted Diagnosis: {'Diabetic' if prediction[0] == 1 else 'Not Diabetic'}")
