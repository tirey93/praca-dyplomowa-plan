import { GroupNameResponse as GroupInfoResponse } from "./groupNameResponse"

export interface UserGroupResponse {
    id: number
    groupInfo: GroupInfoResponse
    isAdmin: boolean
    isCandidate: boolean
}