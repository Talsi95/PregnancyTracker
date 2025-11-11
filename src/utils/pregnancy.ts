import { differenceInCalendarDays, parseISO } from 'date-fns';

export function getPregnancyInfoFromLMP(lmpISO: string, todayDate = new Date()) {
    const lmp = parseISO(lmpISO);
    const days = differenceInCalendarDays(todayDate, lmp);
    if (days < 0) {
        return { valid: false, message: 'תאריך הווסת לא יכול להיות בעתיד.' };
    }

    const weeksCompleted = Math.floor(days / 7);
    const weekNumber = weeksCompleted + 1;
    const dayInWeek = (days % 7) + 1;
    const estimatedDueDate = new Date(lmp);
    estimatedDueDate.setDate(estimatedDueDate.getDate() + 280); // 40 שבועות

    return {
        valid: true,
        weekNumber,
        weeksCompleted,
        dayInWeek,
        gestationalDays: days,
        estimatedDueDate: estimatedDueDate.toISOString().slice(0, 10),
    };
}
