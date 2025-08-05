export interface UpdateActivityRequest {
    activityId: number;
    name: string;
    teacherFullName: string;
    startingHour: number;
    weekDay: string;
    duration: number;
}