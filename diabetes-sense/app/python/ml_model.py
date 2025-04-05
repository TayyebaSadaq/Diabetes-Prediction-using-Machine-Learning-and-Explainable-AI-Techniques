import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold, cross_val_score
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

### Define the features and target variables
X = data[['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']] # Features
y = data['Outcome'] # Target variable

### Splitting the data into training and testing sets (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

### Standardizing the data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Hyperparameter grids
param_grid_lr = {
    'C': [0.1, 1, 10, 100],
    'solver': ['liblinear', 'saga']
}

param_grid_rf = {
    'n_estimators': [100, 200, 300],
    'max_features': ['auto', 'sqrt', 'log2'],
    'max_depth': [4, 6, 8, 10],
    'criterion': ['gini', 'entropy']
}

param_grid_gmb = {
    'n_estimators': [100, 200, 300],
    'learning_rate': [0.01, 0.1, 0.2],
    'max_depth': [3, 4, 5]
}

# Define Stratified K-Fold Cross-Validation
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# Logistic Regression with Cross-Validation
grid_search_lr = GridSearchCV(LogisticRegression(max_iter=500), param_grid_lr, cv=cv, scoring='accuracy')
grid_search_lr.fit(X_train_scaled, y_train)
best_lr = grid_search_lr.best_estimator_
cv_scores_lr = cross_val_score(best_lr, X_train_scaled, y_train, cv=cv, scoring='accuracy')
print(f"Logistic Regression Cross-Validation Accuracy: {cv_scores_lr.mean():.2f} ± {cv_scores_lr.std():.2f}")
y_pred_lr = best_lr.predict(X_test_scaled)
accuracy_lr = accuracy_score(y_test, y_pred_lr)
classification_rep_lr = classification_report(y_test, y_pred_lr)
print(f"Logistic Regression Model (Best Parameters: {grid_search_lr.best_params_})")
print(f"Accuracy: {accuracy_lr:.2f}")
print("\nClassification Report:\n", classification_rep_lr)

# Random Forest with Cross-Validation
grid_search_rf = GridSearchCV(RandomForestClassifier(), param_grid_rf, cv=cv, scoring='accuracy')
grid_search_rf.fit(X_train, y_train)
best_rf = grid_search_rf.best_estimator_
cv_scores_rf = cross_val_score(best_rf, X_train, y_train, cv=cv, scoring='accuracy')
print(f"Random Forest Cross-Validation Accuracy: {cv_scores_rf.mean():.2f} ± {cv_scores_rf.std():.2f}")
y_pred_rf = best_rf.predict(X_test)
accuracy_rf = accuracy_score(y_test, y_pred_rf)
classification_rep_rf = classification_report(y_test, y_pred_rf)
print(f"Random Forest Model (Best Parameters: {grid_search_rf.best_params_})")
print(f"Accuracy: {accuracy_rf:.2f}")
print("\nClassification Report:\n", classification_rep_rf)

# Gradient Boosting with Cross-Validation
grid_search_gmb = GridSearchCV(GradientBoostingClassifier(), param_grid_gmb, cv=cv, scoring='accuracy')
grid_search_gmb.fit(X_train_scaled, y_train)
best_gmb = grid_search_gmb.best_estimator_
cv_scores_gmb = cross_val_score(best_gmb, X_train_scaled, y_train, cv=cv, scoring='accuracy')
print(f"Gradient Boosting Cross-Validation Accuracy: {cv_scores_gmb.mean():.2f} ± {cv_scores_gmb.std():.2f}")
y_pred_gmb = best_gmb.predict(X_test_scaled)
accuracy_gmb = accuracy_score(y_test, y_pred_gmb)
classification_rep_gmb = classification_report(y_test, y_pred_gmb)
print(f"Gradient Boosting Model (Best Parameters: {grid_search_gmb.best_params_})")
print(f"Accuracy: {accuracy_gmb:.2f}")
print("\nClassification Report:\n", classification_rep_gmb)

# Sample prediction and LIME explanation for each model
def sample_prediction_and_explanation(model, model_name, sample, X_train, X_train_scaled, X_test, X_test_scaled, y_test):
    if model_name == "Random Forest":
        sample_data = X_test.iloc[sample:sample+1]
        actual_label = y_test.iloc[sample]
    else:
        sample_data = pd.DataFrame(X_test_scaled).iloc[sample:sample+1]
        actual_label = y_test.iloc[sample]

    prediction = model.predict(sample_data)
    sample_dict = sample_data.iloc[0].to_dict()
    print(f"\n\nSample Patient: {sample_dict}")
    print(f"Actual Diagnosis: {'Diabetic' if actual_label == 1 else 'Not Diabetic'}")
    print(f"Predicted Diagnosis: {'Diabetic' if prediction[0] == 1 else 'Not Diabetic'}")

    # LIME explanation
    explainer = LimeTabularExplainer(X_train.values, mode="classification", feature_names=X_train.columns)
    exp = explainer.explain_instance(sample_data.values[0], model.predict_proba, num_features=8)
    exp.show_in_notebook(show_table=True)

# Sample prediction and explanation for Logistic Regression
sample_prediction_and_explanation(best_lr, "Logistic Regression", 0, X_train, X_train_scaled, X_test, X_test_scaled, y_test)

# Sample prediction and explanation for Random Forest
sample_prediction_and_explanation(best_rf, "Random Forest", 0, X_train, X_train_scaled, X_test, X_test_scaled, y_test)

# Sample prediction and explanation for Gradient Boosting
sample_prediction_and_explanation(best_gmb, "Gradient Boosting", 0, X_train, X_train_scaled, X_test, X_test_scaled, y_test)

# Save the scaler
scaler_filename = r"C:\Users\tayye\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\models\scaler.pkl"
joblib.dump(scaler, scaler_filename)
print(f"Scaler saved successfully at {scaler_filename}")

# Save the test data as a CSV file
test_data_csv_filename = r"C:\Users\tayye\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\data\test_data.csv"
test_data_csv = pd.concat([X_test, y_test], axis=1)
test_data_csv.to_csv(test_data_csv_filename, index=False)
print(f"Test data saved successfully as CSV at {test_data_csv_filename}")

# Save the best models and their accuracies
models = [best_lr, best_rf, best_gmb]
model_names = ["logistic_regression.pkl", "random_forest.pkl", "gradient_boosting.pkl"]
accuracies = [accuracy_lr, accuracy_rf, accuracy_gmb]

model_folder = r"C:\Users\tayye\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\models"

# Save each model and its accuracy
for each, name, accuracy in zip(models, model_names, accuracies):
    joblib.dump((each, accuracy), model_folder + "\\" + name)
    print(f"{name} saved successfully at {model_folder} with accuracy {accuracy:.2f}")