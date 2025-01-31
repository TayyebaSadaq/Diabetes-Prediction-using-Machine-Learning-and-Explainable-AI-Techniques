import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import warnings
warnings.filterwarnings('ignore') # Ignore warnings for better readability

data = pd.read_csv('../../app/data/pima-indians-diabetes.csv')

X = data[['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']] # Features
y = data['Outcome'] # Target variable

# splitting the data into training and testing sets for the model (70% training and 30% testing)
# random state is the seed used by the random number generator
# to ensure that the same sequence of random numbers is generated each time the code is run
# test size is the proportion of the dataset to include in the test split (0.3 is 30%)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# creating the random forest classifier
rf_classifier = RandomForestClassifier(n_estimators = 100, random_state = 42)

# fit the classifier to the training data
rf_classifier.fit(X_train, y_train)

# make predictions
y_pred = rf_classifier.predict(X_test)

# calculate the accuracy and classification report
accuracy = accuracy_score(y_test, y_pred)
classification_rep = classification_report(y_test, y_pred)

# print results
print(f"Accuracy: :{accuracy:.2f}")
print("\nClassification Report:\n", classification_rep)

# sample prediction
sample = X_test.iloc[0:1] # keep as DataFrame to match model input format
prediction = rf_classifier.predict(sample)

# retrieve and display sample
sample_dict = sample.iloc[0].to_dict()
print(f"\n\nSample Patient: {sample_dict}")
print(f"Predicted Diagnosis: {'Diabetic' if prediction[0] == 1 else 'Not Diabetic'}")
