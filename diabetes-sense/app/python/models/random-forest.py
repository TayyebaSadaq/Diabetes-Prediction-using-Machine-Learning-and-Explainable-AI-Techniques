import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.impute import SimpleImputer # for handling missing values
from sklearn.utils import resample # for handling imbalanced data

''' IMPORTING DATA '''
data = pd.read_csv('app\data\pima-indians-diabetes.csv')

''' OBSERVING DATA - SEE JOURNAL NOTES FOR MORE DETAILS '''
#print(data.head())
#data.info()
#print(data.describe(include='all'))

''' DATA PREPROCESSING '''
#sns.heatmap(data.isnull(),cbar = False, cmap = 'magma') # Checking for missing values
#print(data.isnull().sum())

''' were null values replaced with 0s? - handling this '''
error = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin','BMI', 'DiabetesPedigreeFunction']
#print(data[error].isin([0]).sum())

data[error] = data[error].replace(0, np.NaN) # temporarily replace 0s with NaN
#print(data.isnull().sum())

''' impute null values and fill with mean '''
si = SimpleImputer(missing_values=np.nan, strategy='mean')
data[error] = si.fit_transform(data[error])

'''checking null values are fixed - yes'''
#print(data.isnull().sum())

''' is data balanced or imbalanced? - imbalanced'''
sns.countplot(data['Outcome'])
#print(data['Outcome'].value_counts())

''' using upsampling to balance data '''
data_majority = data[data['Outcome'] == 0]
data_minority = data[data['Outcome'] == 1]
upsample = resample(data_minority, replace=True, n_samples=500, random_state=42)   
data = pd.concat([data_majority, upsample])

''' checking if data is balanced '''
sns.countplot(data['Outcome'])
#print(data['Outcome'].value_counts())

''' checking Co-relation '''