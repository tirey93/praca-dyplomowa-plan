import { Injectable } from "@angular/core"
import { environment } from "../../enviroments/enviroments"
import { CookieService } from "ngx-cookie-service"
import { SendRequest } from "./dtos/sendRequest"
import { HttpClient } from "@angular/common/http"
import { MessageDto } from "../signal-r/dtos/message"

@Injectable({
    providedIn: 'root'
  })
  export class GroupRepositoryService {
    protected url = `${environment.host}:${environment.port}/Message`

    constructor(private http: HttpClient, private cookieService: CookieService) { }

    sendByLoggedIn$(request: SendRequest) {
      return this.http.post(`${this.url}/ByLoggedIn`, request, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getByGroup$(groupId: number) {
      return this.http.get<MessageDto>(`${this.url}/Group/${groupId}`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }
}