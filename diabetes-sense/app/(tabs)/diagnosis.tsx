import { Image, StyleSheet, Platform, TextInput, Button, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
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

  const models = ['logistic_regression', 'random_forest', 'gradient_boosting']; 

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

  const windowWidth = useWindowDimensions().width;

  const getResultItemWidth = () => {
    if (windowWidth > 1200) return '30%'; // 3 items per row for large screens
    if (windowWidth > 800) return '45%'; // 2 items per row for medium screens
    return '100%'; // 1 item per row for small screens
  };

  const resultItemWidth = getResultItemWidth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText style={styles.title}>Enter Your Details</ThemedText>
      <View style={styles.formContainer}>
        {Object.keys(formData).map((key) => (
          <View key={key} style={styles.inputRow}>
            <ThemedText style={styles.inputLabel}>{key}:</ThemedText>
            <TextInput
              style={styles.input}
              placeholder={key}
              keyboardType="numeric"
              value={formData[key as keyof typeof formData]}
              onChangeText={(text) => handleChange(key as keyof typeof formData, text)}
            />
          </View>
        ))}
      </View>
      <View style={styles.buttonRow}>
        <View style={styles.submitButton}>
          <Button title="Submit" onPress={handleSubmit} />
        </View>
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
                {model.replace('_', ' ')}
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
              <View key={model} style={[styles.resultItem, { width: resultItemWidth }]}>
                <ThemedText style={styles.resultText}>
                  Model: {model}
                </ThemedText>
                <ThemedText style={styles.resultText}>
                  Prediction: {results[model].prediction}
                </ThemedText>
                <ThemedText style={styles.resultText}>
                  Confidence: {(results[model].confidence * 100).toFixed(2)}%
                </ThemedText>
                <Image
                  source={{ uri: `data:image/png;base64,${results[model].lime_explanation_image}` }}
                  style={styles.explanationImage}
                />
                <ThemedText style={styles.textExplanation}>
                  {results[model].text_explanation}
                </ThemedText>
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
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    width: '100%', // Ensure the container spans the full width
    maxWidth: 1200, // Increase the maximum width for larger screens
    marginHorizontal: 'auto', // Center the container on larger screens
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 800, // Increase the form container width
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '90%',
  },
  inputLabel: {
    width: '40%',
    fontSize: 16,
    color: '#555',
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  toggleMenu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  toggleButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#e6e6e6',
  },
  selectedToggleButton: {
    backgroundColor: '#007BFF',
    borderColor: '#0056b3',
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    marginBottom: 10,
    width: '25%',
  },
  resultsContainer: {
    marginTop: 30,
    width: '100%',
    maxWidth: 1000, // Increase the results container width
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  resultsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping for smaller screens
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  resultItem: {
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  explanationImage: {
    width: '100%', // Allow the image to take up the full width of its container
    height: undefined, // Maintain aspect ratio
    aspectRatio: 1, // Ensure the image is square (1:1 aspect ratio)
    resizeMode: 'contain', // Ensure the image scales without cropping
    marginTop: 10,
  },
  textExplanation: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});