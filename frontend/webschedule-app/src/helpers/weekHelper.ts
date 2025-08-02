export class WeekHelper {
    static getSaturdayOfWeek(weekNumber: number, year: number = new Date().getFullYear()): Date {
        const januaryFirst = new Date(year, 0, 1);
        const dayOfWeek = januaryFirst.getDay();
        const firstMonday = new Date(januaryFirst);
        if (dayOfWeek <= 4) {
            firstMonday.setDate(januaryFirst.getDate() - dayOfWeek + 1);
        } else {
            firstMonday.setDate(januaryFirst.getDate() + 8 - dayOfWeek);
        }
        const saturday = new Date(firstMonday);
        saturday.setDate(firstMonday.getDate() + (weekNumber - 1) * 7 + 5);
        if (saturday < new Date()) {
        return this.getSaturdayOfWeek(weekNumber, year + 1);
        }
        return saturday;
    }

    static getPeriod(date: Date): string {
        const saturday = date.getDate().toString().padStart(2, '0');
        const sundayFull = new Date(date.getTime() + (1000 * 60 * 60 * 24));
        const sunday = sundayFull.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${saturday}-${sunday}.${month}.${year}`
      }
}