// App.tsx
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, I18nManager } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainNavigator from './src/navigation/MainNavigator';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const alreadyApplied = await AsyncStorage.getItem('@rtlApplied');

        if (!I18nManager.isRTL) {
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
        }

        if (!alreadyApplied) {
          await AsyncStorage.setItem('@rtlApplied', 'true');
          if (Updates?.reloadAsync) {
            await Updates.reloadAsync();
            return;
          }
        }

        setReady(true);
      } catch (e) {
        console.error('RTL init error:', e);
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('כדי לקבל תזכורות שבועיות, צריך לאשר קבלת התראות.');
      }
    })();
  }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const theme = {
    ...DefaultTheme,
    isV3: true,
    rtl: true,
    colors: {
      ...DefaultTheme.colors,
      background: 'white',
    },
  };

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1, direction: 'rtl' }}>
        <MainNavigator />
      </View>
    </PaperProvider>
  );
}
