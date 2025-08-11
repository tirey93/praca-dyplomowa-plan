export interface UpdateActivityRequest {
    activityId: number;
    name: string;
    teacherFullName: string;
    room: string;
    startingHour: number;
    weekDay: string;
    duration: number;
}