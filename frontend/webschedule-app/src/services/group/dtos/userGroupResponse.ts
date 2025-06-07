import { GroupResponse } from "./groupResponse";

export interface UserGroupResponse extends GroupResponse {
    isAdmin: boolean
    isCandidate: boolean,
}