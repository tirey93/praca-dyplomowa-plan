import { UserDto } from "./user";

export interface MessageDto {
    content: string;
    groupId: number;
    user: UserDto;
}