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
        <ScrollView style={{ padding: 16 }} contentContainerStyle={{ paddingBottom: 40 }}>
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
                    <Text variant="titleMedium" style={{ marginBottom: 8, fontWeight: 'bold' }}>
                        התפתחות העובר
                    </Text>
                    {Array.isArray(data.fetalDevelopment) ? (
                        data.fetalDevelopment.map((paragraph: string, index: number) => (
                            <Text
                                key={index}
                                variant="bodyLarge"
                                style={[{ marginBottom: 16, lineHeight: 22, width: '100%' }]}
                            >
                                {/* מסיר את התו "*" ומדפיס אותו ככוכבית */}
                                {paragraph.startsWith('* ') ? `★ ${paragraph.substring(2)}` : paragraph}
                            </Text>
                        ))
                    ) : (
                        // מנגנון גיבוי למקרה שזה עדיין מחרוזת ישנה
                        <Text
                            variant="bodyLarge"
                            style={[{ marginBottom: 16, lineHeight: 22, width: '100%' }]}
                        >
                            {data.fetalDevelopment}
                        </Text>
                    )}
                    {/* <Text variant="bodyLarge" style={{ marginBottom: 16, lineHeight: 22 }}>
                        {data.fetalDevelopment}
                    </Text> */}

                    {/* שינויים אצל האם (אם יש נתונים) */}
                    {data.maternalChanges && (
                        <>
                            <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8, width: '100%', fontWeight: 'bold' }}>
                                שינויים אצלך
                            </Text>
                            {Array.isArray(data.maternalChanges) && (
                                data.maternalChanges.map((paragraph: string, index: number) => (
                                    <Text
                                        key={`maternal-${index}`}
                                        variant="bodyLarge"
                                        style={{ marginBottom: 16, lineHeight: 22, width: '100%' }}
                                    >
                                        {paragraph}
                                    </Text>
                                ))
                            )}
                        </>
                    )}

                    {/* בדיקות מומלצות */}
                    <Text variant="titleMedium" style={{ marginBottom: 8, fontWeight: 'bold' }}>
                        בדיקות מומלצות
                    </Text>

                    {data.recommendedTests.length > 0 ? (
                        data.recommendedTests.map((t: string, i: number) => (
                            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4, paddingRight: 4 }}>
                                <Icon
                                    source="check-circle-outline"
                                    size={20}
                                    color="#1E88E5"
                                />
                                <Text>{t}</Text>
                            </View>
                        ))
                    ) : (
                        <Text>אין בדיקות מיוחדות השבוע.</Text>
                    )}

                    {/* טיפים */}
                    <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8, fontWeight: 'bold' }}>
                        טיפים
                    </Text>

                    {data.tips.map((tip: string, i: number) => (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4, paddingRight: 4 }}>
                            <Icon
                                source="star-outline"
                                size={20}
                                color="#FFC107"
                            />
                            <Text>{tip}</Text>
                        </View>
                    ))}
                </Card.Content>
            </Card>
        </ScrollView>
    );
}
