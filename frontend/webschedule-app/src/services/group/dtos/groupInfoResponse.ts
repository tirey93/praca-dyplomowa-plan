import { GroupResponse } from "./groupResponse";

export interface GroupInfoResponse extends GroupResponse {
    membersCount: number,
}