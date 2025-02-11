import { Image, StyleSheet, Platform } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { flingHandlerName } from 'react-native-gesture-handler/lib/typescript/handlers/FlingGestureHandler';

export default function AdviceScreen() {
  return (
     /*blank page*/

     <title>Hello</title>

  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 500,
    width: 500,
    bottom: 0,
    left: 0,
  },
});
