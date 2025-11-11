// src/services/notifications.ts
import * as Notifications from 'expo-notifications';
import { getPregnancyInfoFromLMP } from '../utils/pregnancy';

/**
 * מתזמן התראות שבועיות להריון על פי תאריך הווסת ושם המשתמש
 */
export async function scheduleWeeklyPregnancyNotifications(lmp: string, username: string) {
    const info = getPregnancyInfoFromLMP(lmp);


    await Notifications.cancelAllScheduledNotificationsAsync();


    const lmpDate = new Date(lmp);

    for (let i = info.weeksCompleted + 1; i <= 40; i++) {
        // נחשב תאריך יעד להתראה של כל שבוע
        const nextWeekDate = new Date(lmpDate);
        nextWeekDate.setDate(lmpDate.getDate() + (7 * i));

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `היי ${username}! 🌸`,
                body: `שבוע ${i} מתחיל! לחצי כדי לקרוא על ההתפתחות והבדיקות החדשות שלך.`,
                data: { week: i },
            },
            trigger: {
                type: 'date',
                date: nextWeekDate,
            },
        });
    }

    console.log('✅ התראות שבועיות נקבעו עד שבוע 40');
}
