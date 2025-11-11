import { weeksData } from './weeksData';

export function getWeekContent(weekNumber: number) {
    return weeksData[weekNumber] || { title: "שבוע לא נמצא", content: "אין נתונים לשבוע זה." };
}
