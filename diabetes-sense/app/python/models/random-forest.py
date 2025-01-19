import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import matplotlib.pyplot as plt
import seaborn as sns

data = pd.read_csv('app\data\pima-indians-diabetes.csv')

''' OBSERVING DATA - SEE JOURNAL NOTES FOR MORE DETAILS '''
#print(data.head())
#data.info()
#print(data.describe(include='all'))

''' DATA PREPROCESSING '''
#sns.heatmap(data.isnull(),cbar = False, cmap = 'magma') # Checking for missing values
#print(data.isnull().sum())
''' were null values replaced with 0s? '''
error = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin','BMI', 'DiabetesPedigreeFunction']
print(data[error].isin([0]).sum())

data[error] = data[error].replace(0, np.NaN)
print(data.isnull().sum())