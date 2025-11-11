// src/navigation/MainNavigator.tsx
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LMPInputScreen from '../screens/LMPInputScreen';
import Dashboard from '../screens/Dashboard';
import WeekDetailsScreen from '../screens/WeekDetailsScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, I18nManager } from 'react-native';

const Stack = createStackNavigator();

export default function MainNavigator() {
    const [initialRoute, setInitialRoute] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const lmp = await AsyncStorage.getItem('@lmp');
            const name = await AsyncStorage.getItem('@username');
            if (lmp && name) {
                setInitialRoute('Dashboard');
            } else {
                setInitialRoute('LMPInput');
            }
        })();
    }, []);

    if (!initialRoute) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // ערכת נושא מותאמת עם RTL אמיתי
    const navigationTheme = {
        ...NavigationDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            background: 'white',
            text: 'black',
        },
        direction: I18nManager.isRTL ? 'rtl' : 'ltr',
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator
                initialRouteName={initialRoute}
                screenOptions={{
                    headerTitleAlign: 'center',
                    headerBackTitleVisible: false,
                    headerTitleStyle: {
                        textAlign: 'right',
                        writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
                    },
                    headerStyle: { backgroundColor: '#fff' },
                }}
            >
                <Stack.Screen
                    name="LMPInput"
                    component={LMPInputScreen}
                    options={{ title: 'תאריך וסת' }}
                />
                <Stack.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{ title: 'מעקב שבועי' }}
                />
                <Stack.Screen
                    name="WeekDetails"
                    component={WeekDetailsScreen}
                    options={{ title: 'פרטי שבוע' }}
                />
                <Stack.Screen
                    name="Notifications"
                    component={NotificationSettingsScreen}
                    options={{ title: 'התראות' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
