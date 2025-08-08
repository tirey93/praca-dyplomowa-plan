export interface UpdateActivityRequest {
    activityId: number;
    name: string;
    teacherFullName: string;
    location: string;
    startingHour: number;
    weekDay: string;
    duration: number;
}