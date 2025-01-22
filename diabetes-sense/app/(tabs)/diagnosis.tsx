import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, Button, Alert, View, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';

// Define InputData interface
interface InputData {
  Pregnancies: string;
  Glucose: string;
  BloodPressure: string;
  SkinThickness: string;
  Insulin: string;
  BMI: string;
  DiabetesPedigreeFunction: string;
  Age: string;
}

export default function DiagnosisScreen() {
  // Initialize formData with InputData type
  const [formData, setFormData] = useState<InputData>({
    Pregnancies: '',
    Glucose: '',
    BloodPressure: '',
    SkinThickness: '',
    Insulin: '',
    BMI: '',
    DiabetesPedigreeFunction: '',
    Age: '',
  });

  const [diagnosis, setDiagnosis] = useState<number | null>(null);

  // Handle input change and update formData
  const handleInputChange = (name: keyof InputData, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Sanitize input by replacing commas with dots for decimal numbers
    const sanitizedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value.replace(',', '.'),
      ])
    );
  
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedFormData),  // send sanitized data
      });
  
      const data = await response.json();
      setDiagnosis(data['Diagnosis prediction']);
  
      Alert.alert('Diagnosis', data['Diagnosis prediction'] === 1 ? 'Positive for Diabetes' : 'Negative for Diabetes');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };
  

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFFFFF', dark: '#FFFFFF' }}
      headerImage={
        <Image
          source={require('@/assets/images/adaptive-icon.png')}
          style={styles.reactLogo}
        />
      }>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Enter Your Medical Data</Text>
        {Object.keys(formData).map((field) => (
          <TextInput
            key={field}
            style={styles.input}
            placeholder={field}
            keyboardType="numeric"
            value={formData[field as keyof InputData]}
            onChangeText={(value) => handleInputChange(field as keyof InputData, value)}
          />
        ))}

        <Button title="Submit" onPress={handleSubmit} />

        {diagnosis !== null && (
          <Text style={styles.diagnosisResult}>
            Diagnosis: {diagnosis === 1 ? 'Positive for Diabetes' : 'Negative for Diabetes'}
          </Text>
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  diagnosisResult: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  reactLogo: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    marginTop: 16,
  },
});
