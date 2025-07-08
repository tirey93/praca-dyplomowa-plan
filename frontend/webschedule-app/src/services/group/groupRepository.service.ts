import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../enviroments/enviroments';
import { UserGroupResponse } from './dtos/userGroupResponse';
import { GroupInfoResponse } from './dtos/groupInfoResponse';
import { GroupRequest } from './dtos/groupRequest';
import { GroupResponse } from './dtos/groupResponse';

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

    getCandidateGroups$() {
      return this.http.get<GroupInfoResponse[]>(`${this.url}/Candidate`, {
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
    getNextSubgroup$(year: number, studyMode: string, studyLevel: string, courseId: number) {
      return this.http.get<number>(`${this.url}/subgroup/next?year=${year}&studyMode=${studyMode}&studyLevel=${studyLevel}&courseId=${courseId}`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    create$(groupRequest: GroupRequest) {
      return this.http.post<GroupResponse>(`${this.url}`, groupRequest, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }
  }
