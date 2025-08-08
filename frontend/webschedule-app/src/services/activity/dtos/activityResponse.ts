import { SessionResponse } from "../../session/dtos/sessionResponse";

export interface ActivityResponse {
    activityId: number;
    name: string;
    teacherFullName: string;
    location: string;
    startingHour: number;
    duration: number;
    weekDay: string;
    session: SessionResponse
}