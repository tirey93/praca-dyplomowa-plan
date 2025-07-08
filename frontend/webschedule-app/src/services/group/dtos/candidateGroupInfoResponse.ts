import { GroupInfoResponse } from "./groupInfoResponse";

export interface CandidateGroupInfoResponse extends GroupInfoResponse {
    isCandidate: boolean,
}