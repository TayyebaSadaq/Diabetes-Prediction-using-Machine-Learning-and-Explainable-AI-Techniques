import { Image, StyleSheet, Platform, TextInput, Button } from 'react-native';
import React, { useState } from "react";
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function DiagnosisScreen() {
  const [formData, setFormData] = useState<{
    Pregnancies: string;
    Glucose: string;
    BloodPressure: string;
    SkinThickness: string;
    Insulin: string;
    BMI: string;
    DiabetesPedigreeFunction: string;
    Age: string;
  }>({
    Pregnancies: '',
    Glucose: '',
    BloodPressure: '',
    SkinThickness: '',
    Insulin: '',
    BMI: '',
    DiabetesPedigreeFunction: '',
    Age: ''
  });

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    console.log("User input:", formData);
    // Add API request logic here
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Enter Your Details</ThemedText>
      {Object.keys(formData).map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key}
          keyboardType="numeric"
          value={formData[key as keyof typeof formData]}
          onChangeText={(text) => handleChange(key as keyof typeof formData, text)}
        />
      ))}
      <Button title="Submit" onPress={handleSubmit} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
