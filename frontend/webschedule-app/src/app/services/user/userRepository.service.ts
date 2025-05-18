import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserResponse } from './dtos/userResponse';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../enviroments/enviroments';

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
  }