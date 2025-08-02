import { Injectable } from "@angular/core"
import { environment } from "../../enviroments/enviroments"
import { CookieService } from "ngx-cookie-service"
import { ActivityResponse } from "./dtos/activityResponse"
import { HttpClient } from "@angular/common/http"

@Injectable({
    providedIn: 'root'
  })
  export class ActivityRepositoryService {
    protected url = `${environment.host}:${environment.port}/Activity`

    constructor(private http: HttpClient, private cookieService: CookieService) { }

    getConflicts$(groupId: number, sessionNumber: number, springSemester:boolean, startingHour: number, duration: number) {
        return this.http.get<ActivityResponse[]>(`${this.url}/Conflicts?groupId=${groupId}&sessionNumber=${sessionNumber}&springSemester=${springSemester}&startingHour=${startingHour}&duration=${duration}`, {
            headers: {
            authorization: `Bearer ${this.cookieService.get("token")}`
            }
        })
    }
}