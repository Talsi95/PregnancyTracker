import * as Notifications from 'expo-notifications';
import { getPregnancyInfoFromLMP } from '../utils/pregnancy';

export async function scheduleWeeklyPregnancyNotifications(lmp: string, username: string) {
    const info = getPregnancyInfoFromLMP(lmp);
    const userNameForNotif = username && username.trim() !== '' ? username : 'משתמש';


    await Notifications.cancelAllScheduledNotificationsAsync();


    const lmpDate = new Date(lmp);

    for (let i = info.weeksCompleted + 1; i <= 40; i++) {
        const nextWeekDate = new Date(lmpDate);
        nextWeekDate.setDate(lmpDate.getDate() + (7 * i));

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `היי ${userNameForNotif}! 🌸`,
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
