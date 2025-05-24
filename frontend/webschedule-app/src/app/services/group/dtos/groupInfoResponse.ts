import { GroupResponse } from "./groupResponse";

export interface GroupInfoResponse extends GroupResponse {
    isCandidate: boolean,
    membersCount: number,
}