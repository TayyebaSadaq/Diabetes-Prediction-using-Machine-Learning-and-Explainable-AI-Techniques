import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

// Define an interface for the response
interface PredictionResponse {
  Prediction: string;
  Probability: number;
  RiskLevel: string;
}

const DiagnosisScreen = () => {
  const [pregnancies, setPregnancies] = useState('');
  const [glucose, setGlucose] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [skinThickness, setSkinThickness] = useState('');
  const [insulin, setInsulin] = useState('');
  const [bmi, setBmi] = useState('');
  const [diabetesPedigreeFunction, setDiabetesPedigreeFunction] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = async () => {
    const inputData = {
      Pregnancies: parseInt(pregnancies),
      Glucose: parseInt(glucose),
      BloodPressure: parseInt(bloodPressure),
      SkinThickness: parseInt(skinThickness),
      Insulin: parseInt(insulin),
      BMI: parseFloat(bmi),
      DiabetesPedigreeFunction: parseFloat(diabetesPedigreeFunction),
      Age: parseInt(age),
    };

    try {
      // Log the input data to see if it's correct
      console.log("Sending data:", inputData);

      // Sending POST request to the server
      const response = await axios.post<PredictionResponse>('http://127.0.0.1:5000/predict', inputData);

      // Log the response to make sure it's being received
      console.log("Response data:", response.data);

      const { Prediction, Probability, RiskLevel } = response.data;

      // Show alert if response is correct
      Alert.alert(
        'Prediction Result',
        `Prediction: ${Prediction}\nProbability: ${Probability}\nRisk Level: ${RiskLevel}`
      );
    } catch (error) {
      console.error("Error:", error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Diabetes Prediction</Text>

      <TextInput
        style={styles.input}
        placeholder="Pregnancies (integer)"
        keyboardType="numeric"
        value={pregnancies}
        onChangeText={setPregnancies}
      />
      <TextInput
        style={styles.input}
        placeholder="Glucose (integer)"
        keyboardType="numeric"
        value={glucose}
        onChangeText={setGlucose}
      />
      <TextInput
        style={styles.input}
        placeholder="Blood Pressure (integer)"
        keyboardType="numeric"
        value={bloodPressure}
        onChangeText={setBloodPressure}
      />
      <TextInput
        style={styles.input}
        placeholder="Skin Thickness (integer)"
        keyboardType="numeric"
        value={skinThickness}
        onChangeText={setSkinThickness}
      />
      <TextInput
        style={styles.input}
        placeholder="Insulin (integer)"
        keyboardType="numeric"
        value={insulin}
        onChangeText={setInsulin}
      />
      <TextInput
        style={styles.input}
        placeholder="BMI (decimal)"
        keyboardType="decimal-pad"
        value={bmi}
        onChangeText={setBmi}
      />
      <TextInput
        style={styles.input}
        placeholder="Diabetes Pedigree Function (decimal)"
        keyboardType="decimal-pad"
        value={diabetesPedigreeFunction}
        onChangeText={setDiabetesPedigreeFunction}
      />
      <TextInput
        style={styles.input}
        placeholder="Age (integer)"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <Button title="Submit" onPress={() => { console.log("Submit button clicked!"); handleSubmit(); }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 4,
  },
});

export default DiagnosisScreen;
