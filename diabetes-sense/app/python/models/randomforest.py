import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from lime.lime_tabular import LimeTabularExplainer
import shap
import matplotlib.pyplot as plt
import warnings

warnings.filterwarnings('ignore') # Ignore warnings for better readability

# Load the dataset
data = pd.read_csv(r"C:\Users\Tayyeba\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\data\pima.csv")

# Define features and target variable
X = data[['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']] # Features
y = data['Outcome'] # Target variable

# Splitting the data into training and testing sets (70% training, 30% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Creating the Random Forest classifier
rf_classifier = RandomForestClassifier(n_estimators=100, random_state=42)

# Fit the classifier to the training data
rf_classifier.fit(X_train, y_train)

# Make predictions
y_pred = rf_classifier.predict(X_test)

# Calculate accuracy and classification report
accuracy = accuracy_score(y_test, y_pred)
classification_rep = classification_report(y_test, y_pred)

# Print results
print(f"Accuracy: {accuracy:.2f}")
print("\nClassification Report:\n", classification_rep)

# Sample prediction
sample = X_test.iloc[0:1] # Keep as DataFrame to match model input format
prediction = rf_classifier.predict(sample)

# Retrieve and display sample
sample_dict = sample.iloc[0].to_dict()
print(f"\n\nSample Patient: {sample_dict}")
print(f"Predicted Diagnosis: {'Diabetic' if prediction[0] == 1 else 'Not Diabetic'}")

### LIME IMPLEMENTATION
# Get class names
class_names = ['Not Diabetic', 'Diabetic']

# Get the feature names
feature_names = list(X_train.columns)

# Fit the Explainer on the training data set using the LimeTabularExplainer
explainer = LimeTabularExplainer(X_train.values, feature_names=feature_names, class_names=class_names, mode='classification')

# Display explanation for the sample prediction
explanation = explainer.explain_instance(sample.values[0], rf_classifier.predict_proba)
explanation.show_in_notebook(show_table=True)

### SHAP IMPLEMENTATION
# # load JS visualization code to notebook
# shap.initjs()

# # Create the explainer
# explainer = shap.TreeExplainer(rf_classifier)

# shap_values = explainer.shap_values(X_test)

# print("Variable Importance Plot - Global Interpretation")
# figure = plt.figure()
# shap.summary_plot(shap_values, X_test)
# shap.summary_plot(shap_values[1], X_test)

