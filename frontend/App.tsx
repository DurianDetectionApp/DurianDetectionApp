import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useHistoryStore } from './src/store/historyStore';
import { useSettingsStore } from './src/store/settingsStore';
import { Colors } from './src/theme/colors';

function SplashScreen() {
  return (
    <View style={splashStyles.container}>
      <Text style={splashStyles.emoji}>🍈</Text>
      <Text style={splashStyles.title}>Durly</Text>
      <Text style={splashStyles.subtitle}>Loading...</Text>
    </View>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emoji: { fontSize: 80 },
  title: { fontSize: 36, fontWeight: '900', color: Colors.primaryDark },
  subtitle: { fontSize: 16, color: Colors.textMuted },
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  const { loadHistory } = useHistoryStore();
  const { loadSettings } = useSettingsStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadHistory(), loadSettings()]);
      setReady(true);
    };
    init();
  }, []);

  if (!fontsLoaded || !ready) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.bgLight} />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
