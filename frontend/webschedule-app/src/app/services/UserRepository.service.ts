import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../login/dtos/loginRequest';
import { LoginResponse } from '../login/dtos/loginResponse';
import { UserResponse } from '../login/dtos/userResponse';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
  })
  export class UserRepositoryService {
    protected url = 'http://localhost:5163/User'

    constructor(private http: HttpClient, private cookieService: CookieService) { }

    getLoggedIn$() {
      return this.http.get<UserResponse>(`${this.url}/LoggedIn`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }
  }