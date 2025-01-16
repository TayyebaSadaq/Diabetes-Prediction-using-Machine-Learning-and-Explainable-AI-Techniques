import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Diabetes Sense',
            title: 'Diabetes Sense',
          }}
        />
        <Drawer.Screen
          name="diagnosis" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Diagnosis',
            title: 'Diagnosis',
          }}
        />
        <Drawer.Screen
          name="advice" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Advice and Help',
            title: 'Advice and Help',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
