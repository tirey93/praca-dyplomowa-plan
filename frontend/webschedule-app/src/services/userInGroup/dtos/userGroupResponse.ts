import { GroupResponse } from "../../group/dtos/groupResponse";
import { UserResponse } from "../../user/dtos/userResponse";

export interface UserGroupResponse {
    group: GroupResponse,
    user: UserResponse,
    isAdmin: boolean
    isCandidate: boolean,
}