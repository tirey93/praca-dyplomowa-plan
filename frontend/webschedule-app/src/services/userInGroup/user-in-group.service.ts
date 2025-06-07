import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../enviroments/enviroments';
import { AddCandidateRequest } from './dtos/add-candidate-request';
import { DisenrollFromGroupRequest } from './dtos/disenroll-from-group-request';

@Injectable({
    providedIn: 'root'
  })
  export class UserInGroupService {
    protected url = `${environment.host}:${environment.port}/UserInGroup`

    constructor(private http: HttpClient, private cookieService: CookieService) { }

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
  }