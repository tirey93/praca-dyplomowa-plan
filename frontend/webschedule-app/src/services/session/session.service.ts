import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../enviroments/enviroments';
import { SessionResponse } from './dtos/sessionResponse';
import { UpdateSessionsRequest } from './dtos/updateSessionsRequest';

@Injectable({
    providedIn: 'root'
  })
  export class SessionService {
    protected url = `${environment.host}:${environment.port}/Session`

    constructor(private http: HttpClient, private cookieService: CookieService) { }

    getDefaults$() {
      return this.http.get<SessionResponse[]>(`${this.url}/Default`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getCurrent$(groupId: number) {
      return this.http.get<SessionResponse>(`${this.url}/Group/${groupId}/Current`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getCurrentForLogged$() {
      return this.http.get<SessionResponse>(`${this.url}/CurrentForLogged`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getNext$(sessionNumber: number, weekNumber: number, springSemester: boolean, groupIds: number[]) {
      return this.http.get<SessionResponse>(`${this.url}/Next?sessionNumber=${sessionNumber}&weekNumber=${weekNumber}&springSemester=${springSemester}&groupIds=${groupIds}`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getPrevious$(sessionId: number) {
      return this.http.get<SessionResponse>(`${this.url}/${sessionId}/Previous`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getByGroup$(id: number) {
      return this.http.get<SessionResponse[]>(`${this.url}/Group/${id}`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    updateSession$(request: UpdateSessionsRequest) {
      return this.http.put(`${this.url}/Session`, request, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }
  }