export interface ActivityRequest {
    name: string;
    teacherFullName: string;
    groupId: number;
    sessionNumbers: number[];
    springSemester: boolean;
    startingHour: number;
    weekDay: string;
    duration: number;
}