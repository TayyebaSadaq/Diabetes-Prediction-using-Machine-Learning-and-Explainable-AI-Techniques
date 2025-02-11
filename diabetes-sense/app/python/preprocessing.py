import pandas as pd
import scipy
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import seaborn as sns
import matplotlib.pyplot as plt
import csv

data = pd.read_csv(r"C:\Users\Tayyeba\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\data\pima.csv")
# print(data.head())
# data.info()
# print(data.isnull().sum())

## STATISTICAL ANALYSIS
# print(data.describe())

## OUTLIERS
fig, axs = plt.subplots(9, 1, dpi = 95, figsize = (7,17))
i = 0
for col in data.columns:
    axs[i].boxplot(data[col], vert = False)
    axs[i].set_ylabel(col)
    i += 1
# plt.show()

# Identify the quartiles
q1, q3 = np.percentile(data['Insulin'], [25, 75])
# Calculate the interquartile range
iqr = q3 - q1
# Calculate the lower and upper bounds
lower_bound = q1 - (1.5 * iqr)
upper_bound = q3 + (1.5 * iqr)
# Drop the outliers
clean_data = data[(data['Insulin'] >= lower_bound) 
                & (data['Insulin'] <= upper_bound)]


# Identify the quartiles
q1, q3 = np.percentile(clean_data['Pregnancies'], [25, 75])
# Calculate the interquartile range
iqr = q3 - q1
# Calculate the lower and upper bounds
lower_bound = q1 - (1.5 * iqr)
upper_bound = q3 + (1.5 * iqr)
# Drop the outliers
clean_data = clean_data[(clean_data['Pregnancies'] >= lower_bound) 
                        & (clean_data['Pregnancies'] <= upper_bound)]


# Identify the quartiles
q1, q3 = np.percentile(clean_data['Age'], [25, 75])
# Calculate the interquartile range
iqr = q3 - q1
# Calculate the lower and upper bounds
lower_bound = q1 - (1.5 * iqr)
upper_bound = q3 + (1.5 * iqr)
# Drop the outliers
clean_data = clean_data[(clean_data['Age'] >= lower_bound) 
                        & (clean_data['Age'] <= upper_bound)]


# Identify the quartiles
q1, q3 = np.percentile(clean_data['Glucose'], [25, 75])
# Calculate the interquartile range
iqr = q3 - q1
# Calculate the lower and upper bounds
lower_bound = q1 - (1.5 * iqr)
upper_bound = q3 + (1.5 * iqr)
# Drop the outliers
clean_data = clean_data[(clean_data['Glucose'] >= lower_bound) 
                        & (clean_data['Glucose'] <= upper_bound)]


# Identify the quartiles
q1, q3 = np.percentile(clean_data['BloodPressure'], [25, 75])
# Calculate the interquartile range
iqr = q3 - q1
# Calculate the lower and upper bounds
lower_bound = q1 - (0.75 * iqr)
upper_bound = q3 + (0.75 * iqr)
# Drop the outliers
clean_data = clean_data[(clean_data['BloodPressure'] >= lower_bound) 
                        & (clean_data['BloodPressure'] <= upper_bound)]


# Identify the quartiles 
q1, q3 = np.percentile(clean_data['BMI'], [25, 75])
# Calculate the interquartile range
iqr = q3 - q1
# Calculate the lower and upper bounds
lower_bound = q1 - (1.5 * iqr)
upper_bound = q3 + (1.5 * iqr)
# Drop the outliers
clean_data = clean_data[(clean_data['BMI'] >= lower_bound) 
                        & (clean_data['BMI'] <= upper_bound)]


# Identify the quartiles
q1, q3 = np.percentile(clean_data['DiabetesPedigreeFunction'], [25, 75])
# Calculate the interquartile range
iqr = q3 - q1
# Calculate the lower and upper bounds
lower_bound = q1 - (1.5 * iqr)
upper_bound = q3 + (1.5 * iqr)

# Drop the outliers
clean_data = clean_data[(clean_data['DiabetesPedigreeFunction'] >= lower_bound) 
                        & (clean_data['DiabetesPedigreeFunction'] <= upper_bound)]

fig, axs = plt.subplots(9, 1, dpi = 95, figsize = (7,17))
i = 0
for col in clean_data.columns:
    axs[i].boxplot(clean_data[col], vert = False)
    axs[i].set_ylabel(col)
    i += 1
# plt.show()

corr = clean_data.corr()
plt.figure(dpi = 130)
sns.heatmap(clean_data.corr(), annot = True, fmt = '.2f')
# plt.show()

## OUTCOME PROPORTIONALITY
plt.pie(clean_data.Outcome.value_counts(), 
        labels= ['Diabetes', 'Not Diabetes'], 
        autopct='%.f', shadow=True)
plt.title('Outcome Proportionality')
# plt.show()

## SEPARATE INDEPENDENT FEATURES AND TARGET VARIABLES
X = clean_data.drop(columns = ['Outcome'])
Y = clean_data.Outcome

## NORMALISATION - function since it's only needed for the neural network
def normalisation(X):
    scaler = MinMaxScaler(feature_range = (0, 1))
    
    rescaledX = scaler.fit_transform(X)
    return rescaledX[:5]
    
print(normalisation(X))

# Save as CSV
clean_data.to_csv(r"C:\Users\Tayyeba\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\data\preprocessed_pima.csv", index=False)

# Save as Pickle (for faster loading)
import pickle
with open(r"C:\Users\Tayyeba\Desktop\Diabetes-Prediction-using-Machine-Learning-and-Explainable-AI-Techniques\diabetes-sense\app\data\preprocessed_pima.pkl", "wb") as f:
    pickle.dump(clean_data, f)
