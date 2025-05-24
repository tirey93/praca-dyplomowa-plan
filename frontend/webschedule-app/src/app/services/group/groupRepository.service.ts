import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserGroupResponse } from './dtos/userGroupResponse';
import { environment } from '../../../enviroments/enviroments';
import { GroupInfoResponse } from './dtos/groupInfoResponse';

@Injectable({
    providedIn: 'root'
  })
  export class GroupRepositoryService {
    protected url = `${environment.host}:${environment.port}/Group`

    constructor(private http: HttpClient, private cookieService: CookieService) { }

    getByLoggedIn$() {
      return this.http.get<UserGroupResponse[]>(`${this.url}/ByLoggedIn`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    get$() {
      return this.http.get<GroupInfoResponse[]>(`${this.url}`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getById$(groupId: number) {
      return this.http.get<UserGroupResponse>(`${this.url}/${groupId}`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }
  }