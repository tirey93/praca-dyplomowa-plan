import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../enviroments/enviroments';
import { SessionInGroupResponse } from './dtos/sessionInGroupResponse';
import { UpdateSessionsRequest } from './dtos/updateSessionsRequest';

@Injectable({
    providedIn: 'root'
  })
  export class SessionService {
    protected url = `${environment.host}:${environment.port}/Session`

    constructor(private http: HttpClient, private cookieService: CookieService) { }

    getDefaults$() {
      return this.http.get<SessionInGroupResponse[]>(`${this.url}/Default`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getByGroup$(id: number) {
      return this.http.get<SessionInGroupResponse[]>(`${this.url}/Group/${id}`, {
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