import { SessionRequest } from "../../group/dtos/sessionRequest";

export interface UpdateSessionsRequest {
    groupId: number;
    session: SessionRequest;
}