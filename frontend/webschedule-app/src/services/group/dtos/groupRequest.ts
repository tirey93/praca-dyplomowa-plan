import { SessionRequest } from "./sessionRequest"

export interface GroupRequest {
    year: number,
    courseId: number,
    level: string,
    subgroup: string,
    springSemester: boolean,
    sessions: SessionRequest[];
}