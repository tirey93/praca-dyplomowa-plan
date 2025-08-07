import { UserResponse } from "./userResponse";

export interface UserResponseWithGroupCount extends UserResponse{
    groupCount: number;
}