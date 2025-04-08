import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const adviceSections = [
  {
    title: 'General Advice',
    description: 'Learn about healthy eating, exercise, and more.',
    content: `Diet Tips: Healthy eating advice, what to avoid, and the importance of balanced meals.
Exercise: Recommended physical activities and tips for maintaining an active lifestyle.`,
    icon: 'food-apple',
  },
  {
    title: 'Prevention Tips',
    description: 'Lifestyle changes to lower your risk.',
    content: 'Practical advice for those at risk of developing diabetes, focusing on lifestyle changes that can help prevent it.',
    icon: 'shield-check',
  },
  {
    title: 'When to Seek Help',
    description: 'Know the warning signs.',
    content: 'Warning signs to look for that may require seeing a healthcare professional, such as unusual thirst, frequent urination, or blurred vision.',
    icon: 'alert-circle',
  },
  {
    title: 'Managing Diabetes',
    description: 'Advice for Type 1 and Type 2 diabetes.',
    content: `Tailored advice for individuals with Type 1 and Type 2 diabetes.
Support resources and how to manage diabetes as a newly diagnosed patient, or for those who’ve been managing it for years.`,
    icon: 'heart-pulse',
  },
  {
    title: 'Interactive FAQs',
    description: 'Answers to common questions.',
    content: 'A list of common questions and answers about diabetes, such as "What are the long-term effects?" or "How do I manage diabetes when I\'m sick?"',
    icon: 'help-circle',
  },
  {
    title: 'Resources & Support',
    description: 'Find support groups and forums.',
    content: 'Links to online resources like the Diabetes UK website, online forums, and local support groups for emotional and practical support.',
    icon: 'account-group',
  },
  {
    title: 'Contact a Specialist',
    description: 'Get expert help.',
    content: 'Information on how to get in touch with diabetes specialists or clinics, including appointment booking, helplines, and telemedicine options.',
    icon: 'phone',
  },
  {
    title: 'Stress Management',
    description: 'Tips to manage stress effectively.',
    content: 'How stress can impact diabetes and ways to manage it (meditation, relaxation techniques).',
    icon: 'meditation',
  },
];

export default function AdviceScreen() {
  const [selectedSection, setSelectedSection] = useState(null);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.introSection}>
        <ThemedText style={styles.introHeader}>Welcome to the Advice Section</ThemedText>
        <ThemedText style={styles.introText}>
          Here you can find helpful tips and resources for managing diabetes, preventing complications, and living a healthier life.
        </ThemedText>
      </ThemedView>

      <View style={styles.tilesContainer}>
        {adviceSections.map((section, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tile}
            onPress={() => setSelectedSection(section)}
          >
            <Icon name={section.icon} size={40} color="#007BFF" style={styles.tileIcon} />
            <ThemedText style={styles.tileTitle}>{section.title}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {selectedSection && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={!!selectedSection}
          onRequestClose={() => setSelectedSection(null)}
        >
          <View style={styles.modalOverlay}>
            <ThemedView style={styles.modalContent}>
              <ThemedText style={styles.modalHeader}>{selectedSection.title}</ThemedText>
              <ThemedText>{selectedSection.content}</ThemedText>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedSection(null)}
              >
                <ThemedText style={styles.closeButtonText}>Close</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  introSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  introHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#007BFF',
  },
  introText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    backgroundColor: '#f9f9f9',
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tileIcon: {
    marginBottom: 8,
  },
  tileTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '90%',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
