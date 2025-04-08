import { Image, StyleSheet, Platform, TextInput, Button, ScrollView, TouchableOpacity, useWindowDimensions, Text, Modal } from 'react-native';
import React, { useState } from "react";
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function DiagnosisScreen() {
  // State to hold user input for the form fields
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

  // State to store the prediction results from the backend
  const [results, setResults] = useState<any>(null);

  // State to track which models the user has selected
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  // State to control the visibility of the assistant modal
  const [isAssistantVisible, setIsAssistantVisible] = useState(false);

  // List of available machine learning models
  const models = ['logistic_regression', 'random_forest', 'gradient_boosting'];

  // Function to handle changes in form input fields
  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  // Function to toggle the selection of a model
  const toggleModelSelection = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  // Function to handle form submission and fetch predictions from the backend
  const handleSubmit = async () => {
    console.log("User input:", formData);

    // Convert form data to numeric types for backend processing
    const numericFormData = {
      Pregnancies: parseFloat(formData.Pregnancies),
      Glucose: parseFloat(formData.Glucose),
      BloodPressure: parseFloat(formData.BloodPressure),
      SkinThickness: parseFloat(formData.SkinThickness),
      Insulin: parseFloat(formData.Insulin),
      BMI: parseFloat(formData.BMI),
      DiabetesPedigreeFunction: parseFloat(formData.DiabetesPedigreeFunction),
      Age: parseFloat(formData.Age),
      models: selectedModels.length > 0 ? selectedModels : models, // Use selected models or default to all
    };

    try {
      // Send a POST request to the backend with the form data
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(numericFormData)
      });

      // Parse and store the prediction results
      const result = await response.json();
      console.log('Diagnosis results:', result);
      setResults(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to save the results as an HTML file
  const saveAsHTML = async () => {
    try {
      if (!results) {
        alert('No results available to save.');
        return;
      }

      // Generate an HTML file with the results
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Diabetes Prediction Results</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            .header { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            table, th, td { border: 1px solid #ccc; }
            th, td { padding: 10px; text-align: left; }
            .image-container { text-align: center; margin-top: 20px; }
            .image-container img { max-width: 50%; height: auto; border: 1px solid #ccc; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Diabetes Prediction Results</h1>
          </div>
          <h2>User Input</h2>
          <table>
            ${Object.entries(formData).map(([key, value]) => `<tr><th>${key}</th><td>${value}</td></tr>`).join('')}
          </table>
          <h2>Model Results</h2>
          ${Object.keys(results).map(model => `
            <h3>${model.replace('_', ' ').toUpperCase()}</h3>
            <p><strong>Prediction:</strong> ${results[model].prediction}</p>
            <p><strong>Confidence:</strong> ${(results[model].confidence * 100).toFixed(2)}%</p>
            <div class="image-container">
              <img src="data:image/png;base64,${results[model].lime_explanation_image}" alt="LIME Explanation for ${model}" />
            </div>
            <p><strong>Explanation:</strong> ${results[model].text_explanation}</p>
          `).join('')}
        </body>
        </html>
      `;

      // Save the HTML file locally or share it
      if (Platform.OS === 'web') {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'results.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const fileUri = `${FileSystem.documentDirectory}results.html`;
        await FileSystem.writeAsStringAsync(fileUri, htmlContent);
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error('Error saving HTML:', error);
      if (error instanceof Error) {
        alert(`An error occurred while saving the HTML file: ${error.message}`);
      } else {
        alert('An unknown error occurred while saving the HTML file.');
      }
    }
  };

  // Function to toggle the visibility of the assistant modal
  const toggleAssistant = () => {
    setIsAssistantVisible(!isAssistantVisible);
  };

  // Determine the width of result items based on screen size
  const windowWidth = useWindowDimensions().width;
  const getResultItemWidth = () => {
    if (windowWidth > 1200) return '30%'; // 3 items per row for large screens
    if (windowWidth > 800) return '45%'; // 2 items per row for medium screens
    return '100%'; // 1 item per row for small screens
  };
  const resultItemWidth = getResultItemWidth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Disclaimer Section */}
      <ThemedView style={styles.disclaimerContainer}>
        <ThemedText style={styles.disclaimerText}>
          Disclaimer: This tool is powered by AI and is intended to assist users in understanding potential risks. It should not be used as a sole method for diagnosis. Please consult a healthcare professional for further advice and an official diagnosis.
        </ThemedText>
      </ThemedView>

      {/* Form Section */}
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

      {/* Buttons Section */}
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

      {/* Assistant Modal */}
      <TouchableOpacity style={styles.assistantButton} onPress={toggleAssistant}>
        <Text style={styles.assistantButtonText}>Need Help?</Text>
      </TouchableOpacity>
      <Modal
        visible={isAssistantVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleAssistant}
      >
        <View style={styles.assistantOverlay}>
          <View style={styles.assistantContainer}>
            <Text style={styles.assistantTitle}>How to Use the App</Text>
            <Text style={styles.assistantText}>
              <Text style={styles.boldText}>Enter Your Information:</Text>
              {"\n"}Fill in your details in the form fields.
              {"\n\n"}<Text style={styles.boldText}>Choose Prediction Models:</Text>
              {"\n"}Select the models you'd like to use for your diagnosis. Selecting none automatically provides results for all the models.
              {"\n\n"}<Text style={styles.boldText}>Get Results:</Text>
              {"\n"}Hit "Submit" to see your diagnosis and prediction results.
              {"\n\n"}<Text style={styles.boldText}>Save Your Results:</Text>
              {"\n"}If you'd like, you can save your results as an HTML file for easy access later.
            </Text>
            <Button title="Got it!" onPress={toggleAssistant} />
          </View>
        </View>
      </Modal>

      {/* Results Section */}
      {results && (
        <View style={styles.resultsContainer}>
          <ThemedText style={styles.resultsTitle}>Diagnosis Results:</ThemedText>
          <View style={styles.resultsRow}>
            {Object.keys(results).map((model) => (
              <View key={model} style={[styles.resultItem, { width: resultItemWidth }]}>
                <ThemedText style={styles.resultModelTitle}>
                  {model.replace('_', ' ').toUpperCase()}
                </ThemedText>
                <ThemedText style={styles.resultText}>
                  <Text style={styles.resultLabel}>Prediction:</Text> {results[model].prediction}
                </ThemedText>
                <ThemedText style={styles.resultText}>
                  <Text style={styles.resultLabel}>Confidence:</Text> {(results[model].confidence * 100).toFixed(2)}%
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
          <View style={styles.saveButton}>
            <Button title="Save as HTML" onPress={saveAsHTML} />
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
    maxWidth: '100%', // Increase the maximum width for larger screens
    marginHorizontal: 'auto', // Center the container on larger screens
  },
  disclaimerContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeeba',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 20,
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
    maxWidth: '100%', // Increase the form container width
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
    maxWidth: '100%', 
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
    // Style for each result box, including padding, background color, and shadow
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultModelTitle: {
    // Style for the model title to make it bold and prominent
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultText: {
    // Style for the result text (e.g., prediction and confidence)
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  resultLabel: {
    // Style for labels within the result text to make them stand out
    fontWeight: 'bold',
    color: '#555',
  },
  explanationImage: {
    // Style for the LIME explanation image, ensuring it is clear and well-sized
    width: '90%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginTop: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textExplanation: {
    // Style for the textual explanation, ensuring readability
    marginTop: 15,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  saveButton: {
    marginTop: 20,
    width: '50%',
    alignSelf: 'center',
  },
  assistantButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  assistantButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  assistantOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  assistantContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  assistantTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  assistantText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'left',
    lineHeight: 22,
  },
  boldText: {
    fontWeight: 'bold',
  },
});