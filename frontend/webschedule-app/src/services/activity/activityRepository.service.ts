import { Injectable } from "@angular/core"
import { environment } from "../../enviroments/enviroments"
import { CookieService } from "ngx-cookie-service"
import { ActivityResponse } from "./dtos/activityResponse"
import { HttpClient } from "@angular/common/http"
import { CreateActivityRequest } from "./dtos/createActivityRequest"
import { ActivityInSessionResponse } from "./dtos/activityInSessionResponse"
import { UpdateActivityRequest } from "./dtos/updateActivityRequest"

@Injectable({
    providedIn: 'root'
  })
  export class ActivityRepositoryService {
    protected url = `${environment.host}:${environment.port}/Activity`

    constructor(private http: HttpClient, private cookieService: CookieService) { }

    getById$(activityId: number) {
        return this.http.get<ActivityResponse>(`${this.url}/${activityId}`, {
            headers: {
            authorization: `Bearer ${this.cookieService.get("token")}`
            }
        })
    }

    getConflicts$(groupId: number, sessionNumbers: number[], springSemester:boolean, startingHour: number, duration: number, weekDay: string) {
        return this.http.get<ActivityResponse[]>(`${this.url}/Conflicts?groupId=${groupId}&sessionNumbers=${sessionNumbers}&springSemester=${springSemester}&startingHour=${startingHour}&duration=${duration}&weekDay=${weekDay}`, {
            headers: {
            authorization: `Bearer ${this.cookieService.get("token")}`
            }
        })
    }

    getByCurrentDate$(groupId: number, springSemester:boolean, sessionCount: number) {
        return this.http.get<ActivityInSessionResponse[]>(`${this.url}/Group/${groupId}/ByCurrentDate?springSemester=${springSemester}&sessionCount=${sessionCount}`, {
            headers: {
            authorization: `Bearer ${this.cookieService.get("token")}`
            }
        })
    }

    create$(activityRequest: CreateActivityRequest) {
        return this.http.post(`${this.url}`, activityRequest, {
            headers: {
                authorization: `Bearer ${this.cookieService.get("token")}`
            }
        })
    }

    update$(activityRequest: UpdateActivityRequest) {
        return this.http.put(`${this.url}/${activityRequest.activityId}`, activityRequest, {
            headers: {
                authorization: `Bearer ${this.cookieService.get("token")}`
            }
        })
    }
}