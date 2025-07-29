import { SessionRequest } from "./sessionRequest";

export interface UpdateSessionsRequest {
    groupId: number;
    springSemester: boolean;
    sessions: SessionRequest[];
}