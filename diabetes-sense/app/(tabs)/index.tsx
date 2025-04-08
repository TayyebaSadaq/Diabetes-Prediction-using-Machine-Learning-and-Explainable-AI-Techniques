import { Image, StyleSheet, Platform, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('@/assets/images/app-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText style={styles.headerText}>Welcome to Diabetes Sense</ThemedText>
      </View>
      <View style={styles.descriptionContainer}>
        <ThemedText style={styles.descriptionText}>
          Empowering you with insights and tools to manage diabetes effectively using Machine Learning and Explainable AI.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8, // Add spacing between the logo and the text
  },
  descriptionContainer: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  logo: {
    height: 150,
    width: 150,
  },
});
