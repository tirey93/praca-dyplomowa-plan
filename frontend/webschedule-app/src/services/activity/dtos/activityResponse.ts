import { BuildingResponse } from "../../building/dtos/buildingResponse";
import { SessionResponse } from "../../session/dtos/sessionResponse";

export interface ActivityResponse {
    activityId: number;
    name: string;
    teacherFullName: string;
    room: string;
    startingHour: number;
    duration: number;
    weekDay: string;
    session: SessionResponse;
    building: BuildingResponse;
}