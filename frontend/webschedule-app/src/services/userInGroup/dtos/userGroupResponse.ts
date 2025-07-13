import { GroupResponse } from "../../group/dtos/groupResponse";

export interface UserGroupResponse extends GroupResponse {
    isAdmin: boolean
    isCandidate: boolean,
}