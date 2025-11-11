import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleWeeklyPregnancyNotifications } from '../services/notifications';
import * as Notifications from 'expo-notifications';

export default function NotificationSettingsScreen() {
    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem('@notifTime');
            if (stored) setTime(new Date(stored));
        })();
    }, []);

    const saveTime = async () => {
        await AsyncStorage.setItem('@notifTime', time.toISOString());
        const lmp = await AsyncStorage.getItem('@lmp');
        if (lmp) {
            await Notifications.cancelAllScheduledNotificationsAsync();
            await scheduleWeeklyPregnancyNotifications(lmp);
            alert('התראות תוזמנו מחדש בהצלחה.');
        }
    };

    const cancelAll = async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        alert('כל ההתראות בוטלו.');
    };

    return (
        <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
            <Text variant="titleMedium" style={{ textAlign: 'center', marginBottom: 8 }}>
                שעה נוכחית לתזמון התראות:
            </Text>
            <Text style={{ textAlign: "center" }}>{time.toLocaleTimeString()}</Text>

            <Button mode="outlined" style={{ marginTop: 12 }} onPress={() => setShowPicker(true)}>
                שינוי שעה
            </Button>

            {showPicker && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    onChange={(e, selected) => {
                        setShowPicker(false);
                        if (selected) setTime(selected);
                    }}
                />
            )}

            <Button mode="contained" style={{ marginTop: 20 }} onPress={saveTime}>
                שמור התראות
            </Button>

            <Button mode="text" style={{ marginTop: 10 }} onPress={cancelAll}>
                בטל כל ההתראות
            </Button>
        </View>
    );
}
