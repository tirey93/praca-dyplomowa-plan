export interface CreateActivityRequest {
    name: string;
    teacherFullName: string;
    location: string;
    groupId: number;
    sessionNumbers: number[];
    springSemester: boolean;
    startingHour: number;
    weekDay: string;
    duration: number;
}