import { ActivityResponse } from "./activityResponse";

export interface ActivityInSessionResponse {
    sessionNumber: number;
    activities: ActivityResponse[];
}