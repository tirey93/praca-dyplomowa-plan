import { GroupResponse } from "./groupResponse";

export interface GroupInfoResponse extends GroupResponse {
    isAdmin: boolean
    isCandidate: boolean,
    membersCount: number,
}