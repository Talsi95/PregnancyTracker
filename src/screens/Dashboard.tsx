import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPregnancyInfoFromLMP } from '../utils/pregnancy';
import { Card, Text, Button, ProgressBar } from 'react-native-paper';
import { getWeekContent } from '../utils/content';
import weekImages from '../utils/weekImages';

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

    const progress = Math.min(info.weekNumber / 40, 1);
    const weekText = `שבוע ${info.weekNumber} + ${info.dayInWeek} ימים`;

    return (
        <ScrollView style={{ flex: 1, padding: 16 }} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* כותרת קבלת פנים */}
            <View style={{ width: '100%', marginBottom: 16 }}>
                <Text variant="headlineMedium" style={{ marginBottom: 8 }}>
                    ברוכה הבאה, {name} 🌸
                </Text>
                <Text variant="bodyLarge">
                    כאן תוכלי לראות את המידע המעודכן על ההריון שלך.
                </Text>
            </View>


            {/* ✅ NEW: כרטיס התקדמות */}
            <Card mode="outlined" style={{ marginBottom: 16, width: '100%' }}>
                <Card.Title
                    title="התקדמות ההריון"
                    subtitle={weekText}
                />
                <Card.Content>
                    <ProgressBar progress={progress} color="#FF4081" style={{ height: 10, borderRadius: 10, marginTop: 8, }} />
                    <Text style={{ marginTop: 6 }}>
                        {Math.round(progress * 100)}% מהדרך הושלמה
                    </Text>
                </Card.Content>
            </Card>

            {/* כרטיס מידע שבועי */}
            <Card mode="outlined" style={{ marginBottom: 16, width: '100%' }}>
                <Card.Title
                    title={`שבוע ${info.weekNumber}`}
                    subtitle={`תאריך לידה משוער: ${info.estimatedDueDate}`}
                />
                <Card.Content>
                    <Text variant="bodyLarge" style={{ marginBottom: 8 }}>
                        {weekContent.summary}
                    </Text>

                    {/* ✅ NEW: תמונות של העובר לשבוע הנוכחי */}
                    {weekContent.images && weekContent.images.length > 0 && (

                        <View style={{ marginTop: 10, alignItems: 'center' }}>
                            {weekContent.images.map((img: string, idx: number) => (
                                <Image
                                    key={idx}
                                    source={weekImages[info.weekNumber]}
                                    style={{
                                        width: '100%',
                                        height: 350,
                                        borderRadius: 12,
                                        marginBottom: 10,
                                    }}
                                    resizeMode="cover"
                                />
                            ))}
                        </View>
                    )}
                </Card.Content>
                <Card.Actions style={{ justifyContent: "flex-start" }}>
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