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
import warnings

# Suppress all warnings
warnings.filterwarnings('ignore')

### IMPORTING PREPROCESSED DATA
data = pd.read_pickle(r"C:\Users\tayye\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\data\preprocessed_pima.pkl")

### define the features and target variables
X = data[['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']] # Features
y = data['Outcome'] # Target variable

### Splitting the data into training and testing sets (70% training, 30% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

### standardizing the data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

### LOGISTIC REGRESSION MODEL
lr = LogisticRegression(max_iter=500)
lr.fit(X_train_scaled, y_train)
y_pred_lr = lr.predict(X_test_scaled)
accuracy_lr = accuracy_score(y_test, y_pred_lr)
classification_rep_lr = classification_report(y_test, y_pred_lr)
print(f"Logistic Regression Model")
print(f"Accuracy: {accuracy_lr:.2f}")
print("\nClassification Report:\n", classification_rep_lr)

# Sample prediction for LR
sample_lr = pd.DataFrame(X_test_scaled).iloc[0:1]
prediction_lr = lr.predict(sample_lr)
sample_dict_lr = sample_lr.iloc[0].to_dict()
print(f"\n\nSample Patient: {sample_dict_lr}")
print(f"Predicted Diagnosis: {'Diabetic' if prediction_lr[0] == 1 else 'Not Diabetic'}")

# LIME For Logistic Regression  (which use scaled data)
explainer_lr = LimeTabularExplainer(X_train.values, mode="classification", feature_names=X_train.columns)
exp_lr = explainer_lr.explain_instance(sample_lr.values[0], lr.predict_proba, num_features=8)
exp_lr.show_in_notebook(show_table=True)


# Ensure X_train and X_test are DataFrames - for RF model ONLY
X_train = pd.DataFrame(X_train)
X_test = pd.DataFrame(X_test)

### RANDOM FOREST MODEL
rf = RandomForestClassifier()
rf.fit(X_train, y_train)
y_pred_rf = rf.predict(X_test)
accuracy_rf = accuracy_score(y_test, y_pred_rf)
classification_rep_rf = classification_report(y_test, y_pred_rf)
print(f"Random Forest Model")
print(f"Accuracy: {accuracy_rf:.2f}")
print("\nClassification Report:\n", classification_rep_rf)

# Sample prediction for RF
sample_rf = X_test.iloc[0:1]  # Using iloc to get a single row as a DataFrame
prediction_rf = rf.predict(sample_rf)
sample_dict_rf = sample_rf.iloc[0].to_dict()
print(f"\n\nSample Patient: {sample_dict_rf}")
print(f"Predicted Diagnosis: {'Diabetic' if prediction_rf[0] == 1 else 'Not Diabetic'}")

# LIME For Random Forest (which uses non-scaled data)
explainer_rf = LimeTabularExplainer(X_train.values, mode="classification", feature_names=X_train.columns)
exp_rf = explainer_rf.explain_instance(sample_rf.values[0], rf.predict_proba, num_features=8)
exp_rf.show_in_notebook(show_table=True)


### GRADIENT BOOSTING MODEL
gmb = GradientBoostingClassifier()
gmb.fit(X_train_scaled, y_train)
y_pred_gmb = gmb.predict(X_test_scaled)
accuracy_gmb = accuracy_score(y_test, y_pred_gmb)
classification_rep_gmb = classification_report(y_test, y_pred_gmb)
print(f"Gradient Boosting Model")
print(f"Accuracy: {accuracy_gmb:.2f}")
print("\nClassification Report:\n", classification_rep_gmb)

# Sample prediction for GMB
sample_gmb = pd.DataFrame(X_test_scaled).iloc[0:1]
prediction_gmb = gmb.predict(sample_gmb)
sample_dict_gmb = sample_gmb.iloc[0].to_dict()
print(f"\n\nSample Patient: {sample_dict_gmb}")
print(f"Predicted Diagnosis: {'Diabetic' if prediction_gmb[0] == 1 else 'Not Diabetic'}")

# LIME For Gradient Boosting (which uses scaled data)
explainer_gmb = LimeTabularExplainer(X_train.values, mode="classification", feature_names=X_train.columns)
exp_gmb = explainer_gmb.explain_instance(sample_gmb.values[0], gmb.predict_proba, num_features=8)
exp_gmb.show_in_notebook(show_table=True)


### SAVING MODELS    
models = [lr, rf, gmb]
model_names = ["logistic_regression.pkl", "random_forest.pkl", "gradient_boosting.pkl"]

model_folder = r"C:\Users\tayye\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\models"

# Save each model
for each, name in zip(models, model_names):
    joblib.dump(each, model_folder + "\\" + name)
    print(f"{name} saved successfully at {model_folder}")