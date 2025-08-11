export interface CreateActivityRequest {
    name: string;
    teacherFullName: string;
    room: string;
    groupId: number;
    sessionNumbers: number[];
    springSemester: boolean;
    startingHour: number;
    weekDay: string;
    duration: number;
}