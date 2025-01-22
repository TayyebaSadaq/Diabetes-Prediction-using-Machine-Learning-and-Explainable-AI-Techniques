import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.impute import SimpleImputer # for handling missing values
from sklearn.utils import resample # for handling imbalanced data
from sklearn.model_selection import train_test_split # for splitting the data
from sklearn.preprocessing import StandardScaler # for scaling the data
# IMPORTS FOR RANDOM FOREST 
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import pickle

''' IMPORTING DATA '''
data = pd.read_csv('app\data\pima-indians-diabetes.csv')

''' OBSERVING DATA - SEE JOURNAL NOTES FOR MORE DETAILS '''
# data.head()
# data.info()
# data.describe(include='all')

''' DATA PREPROCESSING '''
sns.heatmap(data.isnull(),cbar = False, cmap = 'magma') # Checking for missing values
data.isnull().sum()

''' were null values replaced with 0s? - handling this '''
error = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin','BMI', 'DiabetesPedigreeFunction']
data[error].isin([0]).sum()

data[error] = data[error].replace(0, np.NaN) # temporarily replace 0s with NaN
data.isnull().sum()

''' impute null values and fill with mean '''
si = SimpleImputer(missing_values=np.nan, strategy='mean')
data[error] = si.fit_transform(data[error])

'''checking null values are fixed - yes'''
data.isnull().sum()

''' is data balanced or imbalanced? - imbalanced '''
sns.countplot(data['Outcome'])
data['Outcome'].value_counts()
# plt.show()

''' using upsampling to balance data '''
data_majority = data[data['Outcome'] == 0]
data_minority = data[data['Outcome'] == 1]
upsample = resample(data_minority, replace=True, n_samples=500, random_state=42)   
data = pd.concat([data_majority, upsample])

''' checking if data is balanced '''
sns.countplot(data['Outcome'])
data['Outcome'].value_counts()
# plt.show()

''' checking Co-relation '''
plt.figure(figsize=(8, 6))
corr = data.corr()  
sns.heatmap(corr, annot=True, cbar=False, cmap='icefire')
# plt.show()

''' SPLITTING THE DATA '''
x = data.drop('Outcome', axis=1)
y = data['Outcome']

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=2529)
x_train.shape, x_test.shape, y_train.shape, y_test.shape

''' SCALING THE DATA '''
ss = StandardScaler()
x_train = ss.fit_transform(x_train)
x_test = ss.transform(x_test)

''' RANDOM FOREST '''
rf = RandomForestClassifier() # initialise random forest classifier
rf.fit(x_train, y_train) # trains model using data (x_train) and target (y_train)
predict_rf = rf.predict(x_test)

print(classification_report(y_test, predict_rf))
print(confusion_matrix(y_test, predict_rf))

''' SAVING THE MODEL '''
with open('app/models/random_forest.pkl', 'wb') as model_file:
    pickle.dump(rf, model_file)
print("Model saved successfully!")