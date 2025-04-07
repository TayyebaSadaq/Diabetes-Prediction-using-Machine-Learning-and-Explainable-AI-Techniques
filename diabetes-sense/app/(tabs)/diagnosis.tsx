import { Image, StyleSheet, Platform, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';
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

  const [results, setResults] = useState<any>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const models = ['logistic_regression', 'random_forest', 'gradient_boosting']; // Updated model names to match backend

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const toggleModelSelection = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
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
      Age: parseFloat(formData.Age),
      models: selectedModels.length > 0 ? selectedModels : models, // Include selected models or default to all
    };

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(numericFormData)
      });

      const result = await response.json();
      console.log('Diagnosis results:', result);
      setResults(result);
    } catch (error) {
      console.error('Error:', error);
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
      <View style={styles.buttonRow}>
        <Button title="Submit" onPress={handleSubmit} style={styles.submitButton} />
        <View style={styles.toggleMenu}>
          {models.map((model) => (
            <TouchableOpacity
              key={model}
              style={[
                styles.toggleButton,
                selectedModels.includes(model) && styles.selectedToggleButton,
              ]}
              onPress={() => toggleModelSelection(model)}
            >
              <ThemedText style={styles.toggleButtonText}>
                {model.replace('_', ' ')} {/* Display model names in a user-friendly format */}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {results && (
        <View style={styles.resultsContainer}>
          <ThemedText style={styles.resultsTitle}>Diagnosis Results:</ThemedText>
          <View style={styles.resultsRow}>
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
                  LIME Explanation:
                </ThemedText>
                <Image
                  source={{ uri: `data:image/png;base64,${results[model].lime_explanation_image}` }}
                  style={styles.explanationImage}
                />
              </View>
            ))}
          </View>
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center', // Center both the submit button and model buttons
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  toggleMenu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center the model buttons
    marginLeft: 10, // Add spacing between the submit button and model buttons
  },
  toggleButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  selectedToggleButton: {
    backgroundColor: '#007BFF',
    borderColor: '#0056b3',
  },
  toggleButtonText: {
    color: '#000',
  },
  submitButton: {
    marginRight: 10, // Add spacing between the submit button and model buttons
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
  resultsRow: {
    flexDirection: 'row', // Arrange items in a row
    flexWrap: 'wrap', // Allow wrapping to the next row if needed
    justifyContent: 'space-around', // Distribute items evenly with space around
    width: '100%', // Ensure full width for proper alignment
  },
  resultItem: {
    marginVertical: 10, // Add vertical margin to separate rows
    alignItems: 'center',
    width: '30%', // Allocate one-third of the width for each column
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
});