import os
import pickle
import joblib  # Add joblib for compatibility
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_curve, auc
import matplotlib.pyplot as plt
from lime.lime_tabular import LimeTabularExplainer

# Define the folder where the models are stored
model_folder = os.getenv('MODEL_FOLDER', os.path.join(os.path.dirname(__file__), '..', 'models'))

# Load the machine learning models and their accuracies
models = {}
accuracies = {}
model_names = ["logistic_regression.pkl", "random_forest.pkl", "gradient_boosting.pkl"]

for name in model_names:
    model_path = os.path.join(model_folder, name)
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
    # Load the model and its accuracy from the file
    model, accuracy = joblib.load(model_path)
    models[name.split('.')[0]] = model  # Use the model name without the file extension as the key
    accuracies[name.split('.')[0]] = accuracy

# Load test data
test_data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'test_data.csv')
test_data = pd.read_csv(test_data_path)
X_test = test_data.drop("target", axis=1)
y_test = test_data["target"]

# Initialize LIME explainer
explainer = LimeTabularExplainer(
    training_data=X_test.values,
    feature_names=X_test.columns,
    class_names=["Non-Diabetic", "Diabetic"],
    mode="classification"
)

# Evaluate each model
for model_name, model in models.items():
    print(f"Evaluating {model_name}...")
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    # Print evaluation metrics
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")
    print(f"Precision: {precision_score(y_test, y_pred):.2f}")
    print(f"Recall: {recall_score(y_test, y_pred):.2f}")
    print(f"F1-Score: {f1_score(y_test, y_pred):.2f}")

    # Generate confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    print(f"Confusion Matrix:\n{cm}")

    # Plot ROC curve
    fpr, tpr, _ = roc_curve(y_test, y_proba)
    roc_auc = auc(fpr, tpr)
    plt.figure()
    plt.plot(fpr, tpr, label=f"{model_name} (AUC = {roc_auc:.2f})")
    plt.plot([0, 1], [0, 1], "k--")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title(f"ROC Curve for {model_name}")
    plt.legend(loc="lower right")
    plt.savefig(f"{model_name}_roc_curve.png")
    plt.close()

# Run LIME explanations on selected instances
selected_instances = X_test.sample(5, random_state=42)
for idx, instance in selected_instances.iterrows():
    explanation = explainer.explain_instance(
        data_row=instance,
        predict_fn=models["logistic_regression"].predict_proba  # Change model as needed
    )
    explanation.save_to_file(f"lime_explanation_{idx}.html")
    explanation.as_pyplot_figure()
    plt.savefig(f"lime_explanation_{idx}.png")
    plt.close()