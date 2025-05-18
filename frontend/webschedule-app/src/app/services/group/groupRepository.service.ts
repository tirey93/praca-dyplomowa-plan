import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserGroupResponse } from './dtos/userGroupResponse';

@Injectable({
    providedIn: 'root'
  })
  export class GroupRepositoryService {
    protected url = 'http://localhost:5163/Group'

    constructor(private http: HttpClient, private cookieService: CookieService) { }

    getByLoggedIn$() {
      return this.http.get<UserGroupResponse[]>(`${this.url}/ByLoggedIn`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }
  }