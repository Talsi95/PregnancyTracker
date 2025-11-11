import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Text, Icon } from 'react-native-paper';
import { getWeekContent } from '../utils/content';

export default function WeekDetailsScreen({ route }: any) {
    const { week } = route.params;
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        (async () => {
            const content = await getWeekContent(week);
            setData(content);
        })();
    }, [week]);

    if (!data) return null;

    return (
        <ScrollView style={{ padding: 16 }}>
            <Card mode="outlined" style={{ width: '100%' }}>
                <Card.Title
                    title={data.title}
                    titleStyle={{ fontWeight: 'bold', fontSize: 20 }}
                />

                <Card.Content>
                    {/* סיכום שבועי */}
                    <Text
                        variant="bodyLarge"
                        style={{ marginBottom: 16, lineHeight: 22, fontStyle: 'italic' }}
                    >
                        {data.summary}
                    </Text>

                    {/* התפתחות העובר */}
                    <Text variant="titleMedium" style={{ marginBottom: 8 }}>
                        התפתחות העובר
                    </Text>
                    <Text variant="bodyLarge" style={{ marginBottom: 16, lineHeight: 22 }}>
                        {data.fetalDevelopment}
                    </Text>

                    {/* בדיקות מומלצות */}
                    <Text variant="titleMedium" style={{ marginBottom: 8 }}>
                        בדיקות מומלצות
                    </Text>

                    {data.recommendedTests.length > 0 ? (
                        data.recommendedTests.map((t: string, i: number) => (
                            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                <Icon
                                    source="check-circle-outline"
                                    size={20}
                                    color="#1E88E5"
                                    style={{ marginRight: 8 }}
                                />
                                <Text>{t}</Text>
                            </View>
                        ))
                    ) : (
                        <Text>אין בדיקות מיוחדות השבוע.</Text>
                    )}

                    {/* טיפים */}
                    <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8 }}>
                        טיפים
                    </Text>

                    {data.tips.map((tip: string, i: number) => (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <Icon
                                source="star-outline"
                                size={20}
                                color="#FFC107"
                                style={{ marginRight: 8 }}
                            />
                            <Text>{tip}</Text>
                        </View>
                    ))}
                </Card.Content>
            </Card>
        </ScrollView>
    );
}
