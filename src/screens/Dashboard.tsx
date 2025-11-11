import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPregnancyInfoFromLMP } from '../utils/pregnancy';
import { Card, Text, Button } from 'react-native-paper';
import { getWeekContent } from '../utils/content';

export default function Dashboard({ navigation }: any) {
    const [info, setInfo] = useState<any>(null);
    const [weekContent, setWeekContent] = useState<any>(null);
    const [name, setName] = useState('');

    useEffect(() => {
        (async () => {
            const lmp = await AsyncStorage.getItem('@lmp');
            const storedName = await AsyncStorage.getItem('@username');

            if (!lmp || !storedName) {
                navigation.replace('LMPInput');
                return;
            }

            setName(storedName);

            const data = getPregnancyInfoFromLMP(lmp);
            setInfo(data);

            const content = await getWeekContent(data.weekNumber);
            setWeekContent(content);
        })();
    }, []);

    if (!info || !weekContent) return null;

    return (
        <ScrollView style={{ flex: 1, padding: 16 }}>
            {/* כותרת קבלת פנים */}
            <View style={{ width: '100%', marginBottom: 16 }}>
                <Text variant="headlineMedium" style={{ marginBottom: 8 }}>
                    ברוכה הבאה, {name} 🌸
                </Text>
                <Text variant="bodyLarge">
                    כאן תוכלי לראות את המידע המעודכן על ההריון שלך.
                </Text>
            </View>

            {/* כרטיס מידע שבועי */}
            <Card mode="outlined" style={{ marginBottom: 16, width: '100%' }}>
                <Card.Title
                    title={`שבוע ${info.weekNumber}`}
                    subtitle={`תאריך לידה משוער: ${info.estimatedDueDate}`}
                />
                <Card.Content>
                    <Text variant="bodyLarge">{weekContent.summary}</Text>
                </Card.Content>
                <Card.Actions style={{ justifyContent: 'right' }}>
                    <Button
                        onPress={() =>
                            navigation.navigate('WeekDetails', { week: info.weekNumber })
                        }
                    >
                        פרטי השבוע
                    </Button>
                </Card.Actions>
            </Card>

            {/* כפתורים תחתונים */}
            <Button
                mode="contained"
                style={{ marginBottom: 10 }}
                onPress={() => navigation.navigate('Notifications')}
            >
                הגדרות התראות
            </Button>

            <Button onPress={() => navigation.navigate('LMPInput')}>
                שינוי תאריך וסת
            </Button>
        </ScrollView>
    );
}
