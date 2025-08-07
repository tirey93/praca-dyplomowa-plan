import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../enviroments/enviroments';
import { UserResponse } from './dtos/userResponse';
import { UpdateUserLoginRequest } from './dtos/updateUserLoginRequest';
import { UpdateUserDisplayNameRequest } from './dtos/updateUserDisplayNameRequest';
import { UpdateUserPasswordRequest } from './dtos/updateUserPasswordRequest';
import { UserResponseWithGroupCount } from './dtos/userWithGroupCountResponse';

@Injectable({
    providedIn: 'root'
  })
  export class UserRepositoryService {
    protected url = `${environment.host}:${environment.port}/User`

    constructor(private http: HttpClient, private cookieService: CookieService) { }

    getLoggedIn$() {
      return this.http.get<UserResponse>(`${this.url}/LoggedIn`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    get$() {
      return this.http.get<UserResponseWithGroupCount[]>(`${this.url}`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    updateLogin$(command: UpdateUserLoginRequest) {
      return this.http.put(`${this.url}/Login`, command, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    updateDisplayName$(command: UpdateUserDisplayNameRequest) {
      return this.http.put(`${this.url}/DisplayName`, command, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }

    updatePassword$(command: UpdateUserPasswordRequest) {
      return this.http.put(`${this.url}/Password`, command, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }
  }