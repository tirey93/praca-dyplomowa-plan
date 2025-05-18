import { UserGroupResponse } from "../../group/dtos/userGroupResponse"

export interface UserResponse {
    id: number,
    name: string,
    displayName: string,
    isActive: boolean
    groups: UserGroupResponse[]
}