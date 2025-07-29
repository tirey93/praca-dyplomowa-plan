import { SessionRequest } from "./sessionRequest"

export interface GroupRequest {
    year: number,
    courseId: number,
    level: string,
    subgroup: string
    sessions: SessionRequest[];
}