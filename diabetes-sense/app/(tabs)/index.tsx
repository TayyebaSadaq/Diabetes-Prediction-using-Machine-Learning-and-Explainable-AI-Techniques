import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; 
import { ThemedView } from '@/components/ThemedView'; 
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Hero Section with Mission Statement */}
      <View style={styles.heroSection}>
        <ThemedText style={styles.heroTitle}>Welcome to Diabetes Sense</ThemedText>
        <ThemedText style={styles.heroSubtitle}>
          Bridging the gap between accessible diagnosis and proactive health management for diabetes.
        </ThemedText>
      </View>

      {/* Motivation Section */}
      <View style={styles.motivationSection}>
        <ThemedText style={styles.sectionTitle}>Our Motivation</ThemedText>
        <ThemedText style={styles.sectionText}>
          Diabetes alone is a prevalent condition most people face, however only a small percentage of the population is often aware of their underlying condition and fewer still manage to live a less detrimental lifestyle as a result. This lack of knowledge and understanding of your own health conditions is prevalent in less developed countries and can often be a leading cause of death. A condition that can often be managed through small shifts and changes in one’s lifestyle, diet, and environment is something that ought to have accessible diagnosis available to patients. 
        </ThemedText>
        <ThemedText style={styles.sectionText}>
          Creating an application that allows for people to input their medical data safely and securely to provide several predictions helps bridge the current gap in global healthcare systems, especially in less developed regions where support and treatment are lacking.
        </ThemedText>
      </View>

      {/* Features Tiles Section */}
      <View style={styles.featuresSection}>
        <ThemedText style={styles.sectionTitle}>What Diabetes Sense Offers</ThemedText>
        <ScrollView contentContainerStyle={styles.tilesContainer}>
          <View style={styles.tile}>
            <View style={styles.tileLeft}>
              <FontAwesome name="stethoscope" size={30} color="#007AFF" />
              <ThemedText style={styles.tileTitle}>AI-Powered Diagnosis</ThemedText>
            </View>
            <ThemedText style={styles.tileDescription}>
              Leverage cutting-edge AI models to predict and diagnose diabetes with accuracy.
            </ThemedText>
          </View>

          <View style={styles.tile}>
            <View style={styles.tileLeft}>
              <FontAwesome name="lightbulb-o" size={30} color="#007AFF" />
              <ThemedText style={styles.tileTitle}>Explainable Insights</ThemedText>
            </View>
            <ThemedText style={styles.tileDescription}>
              Understand the reasoning behind predictions with transparent AI explanations.
            </ThemedText>
          </View>

          <View style={styles.tile}>
            <View style={styles.tileLeft}>
              <FontAwesome name="globe" size={30} color="#007AFF" />
              <ThemedText style={styles.tileTitle}>Global Accessibility</ThemedText>
            </View>
            <ThemedText style={styles.tileDescription}>
              Designed to be accessible for users worldwide, especially in underserved regions.
            </ThemedText>
          </View>

          <View style={styles.tile}>
            <View style={styles.tileLeft}>
              <FontAwesome name="heart" size={30} color="#007AFF" />
              <ThemedText style={styles.tileTitle}>Management & Lifestyle Advice</ThemedText>
            </View>
            <ThemedText style={styles.tileDescription}>
              Receive personalized recommendations to manage (pre)diabetes through lifestyle and dietary changes.
            </ThemedText>
          </View>
        </ScrollView>
      </View>

      {/* Research Aims Section */}
      <View style={styles.researchAimsSection}>
        <ThemedText style={styles.sectionTitle}>Research Aims & Objectives</ThemedText>
        <ThemedText style={styles.sectionText}>
          This study aims to bridge the gap between traditional diagnostic approaches and modern AI techniques by implementing a web and mobile application that leverages XAI frameworks alongside ML models. By doing so, it seeks to improve the accessibility, interpretability, and effectiveness of diabetes diagnosis, contributing to better health outcomes and fostering awareness around diabetes.
        </ThemedText>
        <ThemedText style={styles.sectionText}>
          Furthermore, this research will address the strengths and limitations of XAI frameworks, with a focus on creating more transparent, patient-centered, and accessible healthcare solutions.
        </ThemedText>
      </View>

      {/* Contact Section */}
      <View style={styles.contactSection}>
        <ThemedText style={styles.contactText}>
          For questions or suggestions, contact us at:
        </ThemedText>
        <ThemedText style={styles.contactEmail}>tayyeba.dev@gmail.com</ThemedText>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>© 2025 Diabetes Sense. All rights reserved.</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heroSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    maxWidth: 600,
  },
  motivationSection: {
    marginTop: 30,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
    lineHeight: 24,
  },
  featuresSection: {
    marginTop: 30,
    marginBottom: 40,
  },
  tilesContainer: {
    flexDirection: 'column',
    marginBottom: 40,
  },
  tile: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)',
  },
  tileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  tileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  tileDescription: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    lineHeight: 20,
  },
  researchAimsSection: {
    marginTop: 30,
    marginBottom: 40,
  },
  contactSection: {
    marginTop: 40,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 16,
    color: '#333',
  },
  contactEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f9f9f9',
  },
  footerText: {
    fontSize: 14,
    color: '#333',
  },
});
