import { Injectable } from "@angular/core"
import { environment } from "../../enviroments/enviroments"
import { CookieService } from "ngx-cookie-service"
import { ActivityResponse } from "./dtos/activityResponse"
import { HttpClient } from "@angular/common/http"
import { ActivityRequest } from "./dtos/activityRequest"
import { ActivityInSessionResponse } from "./dtos/activityInSessionResponse"

@Injectable({
    providedIn: 'root'
  })
  export class ActivityRepositoryService {
    protected url = `${environment.host}:${environment.port}/Activity`

    constructor(private http: HttpClient, private cookieService: CookieService) { }

    getConflicts$(groupId: number, sessionNumbers: number[], springSemester:boolean, startingHour: number, duration: number, weekDay: string) {
        return this.http.get<ActivityResponse[]>(`${this.url}/Conflicts?groupId=${groupId}&sessionNumbers=${sessionNumbers}&springSemester=${springSemester}&startingHour=${startingHour}&duration=${duration}&weekDay=${weekDay}`, {
            headers: {
            authorization: `Bearer ${this.cookieService.get("token")}`
            }
        })
    }

    getByCurrentDate$(groupId: number, springSemester:boolean, sessionCount: number) {
        return this.http.get<ActivityInSessionResponse[]>(`${this.url}/Group?groupId=${groupId}&springSemester=${springSemester}&sessionCount=${sessionCount}`, {
            headers: {
            authorization: `Bearer ${this.cookieService.get("token")}`
            }
        })
    }

    create$(activityRequest: ActivityRequest) {
        return this.http.post(`${this.url}`, activityRequest, {
            headers: {
                authorization: `Bearer ${this.cookieService.get("token")}`
            }
        })
    }
}