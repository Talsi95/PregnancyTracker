// src/screens/LMPInputScreen.tsx
import React, { useState } from 'react';
import { View, Platform, I18nManager } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPregnancyInfoFromLMP } from '../utils/pregnancy';
import { scheduleWeeklyPregnancyNotifications } from '../services/notifications';

export default function LMPInputScreen({ navigation }: any) {
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const onSave = async () => {
        const iso = date.toISOString().slice(0, 10);

        if (!name.trim()) {
            alert('אנא הזיני שם');
            return;
        }

        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        const weeksPassed = Math.floor(diffInDays / 7);

        if (date > now) {
            alert('תאריך הווסת לא יכול להיות בעתיד.');
            return;
        }

        if (weeksPassed > 40) {
            alert('עברו כבר יותר מ-40 שבועות מהתאריך שנבחר. אנא הזיני תאריך עדכני יותר.');
            return;
        }

        await AsyncStorage.multiSet([
            ['@lmp', iso],
            ['@username', name],
        ]);

        const finalName = await AsyncStorage.getItem('@username') || 'משתמש';

        const info = getPregnancyInfoFromLMP(iso);
        console.log('Pregnancy info:', info);

        await scheduleWeeklyPregnancyNotifications(iso, finalName);
        navigation.replace('Dashboard');
    };

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
            <Text
                style={{
                    textAlign: 'center',
                    fontSize: 20,
                    marginBottom: 12,
                    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
                }}
            >
                הזיני את שמך:
            </Text>

            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="הקלידי שם"
                mode="outlined"
                style={{
                    marginBottom: 20,
                    textAlign: 'right',
                    writingDirection: 'rtl',
                    fontFamily: Platform.OS === 'ios' ? 'Arial Hebrew' : undefined, // גופן שתומך בעברית
                }}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="name"
                keyboardType="default"
                inputMode="text"
                multiline={false}
                textAlign="right"
                textAlignVertical="center"
                returnKeyType="done"
                autoComplete="off"
                lang="he"
                importantForAutofill="no"
                right={<TextInput.Icon icon="account" />}
                placeholderTextColor="#aaa"
            />


            <Text
                style={{
                    textAlign: 'center',
                    fontSize: 20,
                    marginBottom: 12,
                    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
                }}
            >
                בחרי את תאריך הווסת האחרון שלך:
            </Text>

            <Button mode="outlined" onPress={() => setShowPicker(true)}>
                בחרי תאריך
            </Button>

            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(e, selected) => {
                        setShowPicker(false);
                        if (selected) setDate(selected);
                    }}
                />
            )}

            <View style={{ height: 20 }} />

            <Button mode="contained" onPress={onSave}>
                שמירה והמשך
            </Button>
        </View>
    );
}
