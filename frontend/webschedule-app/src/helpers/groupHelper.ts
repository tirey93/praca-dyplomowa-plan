import { GroupResponse } from "../services/group/dtos/groupResponse";

export class GroupHelper {
    static groupInfoToString(groupName: GroupResponse): string {
        return `${this.parseStartingYear(groupName.startingYear)}${this.parseStudyMode(groupName.studyMode)}${this.parseStudyLevel(groupName.studyLevel)}${this.parseShortName(groupName.studyCourseShort)}${this.parseSubgroup(groupName.subgroup)}`;
    }
    static parseSubgroup(subgroup: number) {
        return subgroup.toLocaleString('en-us', {minimumIntegerDigits: 2})
    }
    private static parseStartingYear(startingYear: number): string {
        return startingYear.toString().substring(2);
    }
    private static parseStudyMode(studyMode: string): string {
        switch (studyMode) {
            case "FullTime":
                return "S"
            case "PartTime":
                return "N"
            default:
                return "";
        }
    }
    private static parseStudyLevel(studyLevel: string): string {
        switch (studyLevel) {
            case "Bachelor":
                return "L"
            case "Master":
                return "M"
            case "Engineer":
                return "I"
            default:
                return "";
        }
    }
    private static parseShortName(shortName: string): string {
        return shortName.toUpperCase();
    }
}