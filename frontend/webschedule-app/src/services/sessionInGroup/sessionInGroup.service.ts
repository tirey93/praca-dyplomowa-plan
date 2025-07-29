import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../enviroments/enviroments';
import { SessionInGroupResponse } from './dtos/sessionInGroupResponse';

@Injectable({
    providedIn: 'root'
  })
  export class SessionInGroupService {
    protected url = `${environment.host}:${environment.port}/SessionInGroup`

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
  }