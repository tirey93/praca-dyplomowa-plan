import { SessionInGroupResponse } from "../../session/dtos/sessionInGroupResponse";

export interface ActivityResponse {
    activityId: number;
    name: string;
    teacherFullName: string;
    startingHour: number;
    duration: number;
    weekDay: string;
    session: SessionInGroupResponse
}