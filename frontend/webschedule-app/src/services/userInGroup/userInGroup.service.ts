import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../enviroments/enviroments';
import { AddCandidateRequest } from './dtos/add-candidate-request';
import { DisenrollFromGroupRequest } from './dtos/disenroll-from-group-request';
import { UserGroupResponse } from './dtos/userGroupResponse';
import { ChangeRoleRequest } from './dtos/changeRoleRequest';

@Injectable({
    providedIn: 'root'
  })
  export class UserInGroupService {
    protected url = `${environment.host}:${environment.port}/UserInGroup`

    constructor(private http: HttpClient, private cookieService: CookieService) { }

    loggedInHasAdminToGroup$(groupId: number) {
      return this.http.get<boolean>(`${this.url}/Group/${groupId}/LoggedIn/HasAdmin`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getByUserId$(userId: number) {
      return this.http.get<UserGroupResponse[]>(`${this.url}/ByUser/${userId}`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getByLoggedIn$() {
      return this.http.get<UserGroupResponse[]>(`${this.url}/ByLoggedIn`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getCandidatesByLoggedIn$() {
      return this.http.get<UserGroupResponse[]>(`${this.url}/Candidates/ByLoggedIn`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getGroupCandidates$(groupId: number) {
      return this.http.get<UserGroupResponse[]>(`${this.url}/Group/${groupId}/Candidates`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getLoggedInByGroup$(groupId: number | undefined) {
      return this.http.get<UserGroupResponse>(`${this.url}/Group/${groupId}/ByLoggedIn`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getByGroup$(groupId: number | undefined, exceptLoggedIn: boolean = false) {
      return this.http.get<UserGroupResponse[]>(`${this.url}/Group/${groupId}?exceptLoggedIn=${exceptLoggedIn}`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }
    
    addCandidate$(request: AddCandidateRequest) {
      return this.http.post(`${this.url}`, request, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        },
      })
    }

    disenrollFromGroup$(request: DisenrollFromGroupRequest) {
      return this.http.put(`${this.url}/Disenroll`, request, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        },
      })
    }

    changeRole$(request: ChangeRoleRequest) {
      return this.http.put(`${this.url}/Role`, request, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        },
      })
    }
  }