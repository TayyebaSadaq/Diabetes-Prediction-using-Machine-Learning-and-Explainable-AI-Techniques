import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from sklearn.model_selection import train_test_split
from sklearn import metrics
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import GradientBoostingClassifier

from lime.lime_tabular import LimeTabularExplainer
import shap

import warnings

### IMPORTING PREPROCESSED DATA
data = pd.read_csv(r"C:\Users\tayye\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\data\preprocessed_pima.csv")

### define the features and target variables
X = data[['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']] # Features
y = data['Outcome'] # Target variable

### Splitting the data into training and testing sets (70% training, 30% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

### CREATING CLASSIFIERS FOR MODELS
models = [LogisticRegression(max_iter=500), RandomForestClassifier(), GradientBoostingClassifier()]

for each in models:
    each.fit(X_train, y_train)
    y_pred = each.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    classification_rep = classification_report(y_test, y_pred)
    print(f"{each} Model")
    print(f"Accuracy: {accuracy:.2f}")
    print("\nClassification Report:\n", classification_rep)
    
    # sample prediction
    sample = X_test.iloc[0:1] # Keep as DataFrame to match model input format
    prediction = each.predict(sample)
    sample_dict = sample.iloc[0].to_dict()
    print(f"\n\nSample Patient: {sample_dict}")
    print(f"Predicted Diagnosis: {'Diabetic' if prediction[0] == 1 else 'Not Diabetic'}")
    
    ## LIME EXPLANATION
    explainer = LimeTabularExplainer(X_train.values, mode="classification", feature_names=X_train.columns)
    exp = explainer.explain_instance(sample.values[0], each.predict_proba, num_features=8)
    exp.show_in_notebook(show_table=True)

    ## SHAP EXPLANATION
    ### not yet implemented ###
    
# ### SAVING MODELS    
# model_names = ["logistic_regression.pkl", "random_forest.pkl", "gradient_boosting.pkl"]
# model_folder = r"C:\Users\tayye\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\models"
# for each, name in zip(models, model_names):
#     joblib.dump(each, model_folder + "\\" + name)
#     print(f"{name} saved successfully at {model_folder}")