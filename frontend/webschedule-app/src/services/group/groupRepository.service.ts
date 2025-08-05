import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../enviroments/enviroments';
import { GroupRequest } from './dtos/groupRequest';
import { GroupResponse } from './dtos/groupResponse';
import { GroupInfoResponse } from './dtos/groupInfoResponse';
import { UpdaterSemesterRequest } from './dtos/updateSemesterRequest';

@Injectable({
    providedIn: 'root'
  })
  export class GroupRepositoryService {
    protected url = `${environment.host}:${environment.port}/Group`

    constructor(private http: HttpClient, private cookieService: CookieService) { }

    canLeaveGroup$(groupId: number) {
      return this.http.get<boolean>(`${this.url}/${groupId}/LoggedUserCanLeave`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getGroups$(exceptLoggedIn: boolean = false) {
      return this.http.get<GroupInfoResponse[]>(`${this.url}?exceptLoggedIn=${exceptLoggedIn}`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getGroupsById$(ids: number[]) {
      return this.http.get<GroupInfoResponse[]>(`${this.url}/ByIds?ids=${ids}`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    isGroupExists$(groupId: number | undefined) {
      return this.http.get<boolean>(`${this.url}/${groupId}/Exists`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    getNextSubgroup$(year: number, studyLevel: string, courseId: number) {
      return this.http.get<number>(`${this.url}/subgroup/next?year=${year}&studyLevel=${studyLevel}&courseId=${courseId}`, {
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

    remove$(groupId: number) {
      return this.http.delete(`${this.url}/${groupId}`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    updateSemester$(request : UpdaterSemesterRequest) {
      return this.http.put<GroupResponse>(`${this.url}/Semester`, request, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }
  }
