import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, Button, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

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

  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    console.log("User input:", formData);

    // Convert form data to numeric types
    const numericFormData = {
      Pregnancies: parseFloat(formData.Pregnancies),
      Glucose: parseFloat(formData.Glucose),
      BloodPressure: parseFloat(formData.BloodPressure),
      SkinThickness: parseFloat(formData.SkinThickness),
      Insulin: parseFloat(formData.Insulin),
      BMI: parseFloat(formData.BMI),
      DiabetesPedigreeFunction: parseFloat(formData.DiabetesPedigreeFunction),
      Age: parseFloat(formData.Age)
    };

    try {
      const response = await fetch('https://diabetes-prediction-using-machine-42pk.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(numericFormData)
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Diagnosis results:', result);
        setResults(result);
        setError(null);
      } else {
        console.error('Error:', result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      {error && (
        <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
      )}
      {results && (
        <View style={styles.resultsContainer}>
          <ThemedText style={styles.resultsTitle}>Diagnosis Results:</ThemedText>
          {Object.keys(results).map((model) => (
            <View key={model} style={styles.resultItem}>
              <ThemedText style={styles.resultText}>
                Model: {model}
              </ThemedText>
              <ThemedText style={styles.resultText}>
                Prediction: {results[model].prediction}
              </ThemedText>
              <ThemedText style={styles.resultText}>
                Confidence: {(results[model].confidence * 100).toFixed(2)}%
              </ThemedText>
              <ThemedText style={styles.resultText}>
                Accuracy: {(results[model].accuracy * 100).toFixed(2)}%
              </ThemedText>
              <ThemedText style={styles.resultText}>
                LIME Explanation:
              </ThemedText>
              <Image
                source={{ uri: `data:image/png;base64,${results[model].lime_explanation_image}` }}
                style={styles.explanationImage}
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
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
  resultsContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultItem: {
    marginBottom: 10,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
  },
  explanationImage: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});