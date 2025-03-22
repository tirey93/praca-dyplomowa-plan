import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../login/dtos/loginRequest';
import { LoginResponse } from '../login/dtos/loginResponse';
import { UserResponse } from '../login/dtos/userResponse';

@Injectable({
    providedIn: 'root'
  })
  export class AuthenticationRepositoryService {
    protected url = 'http://localhost:5163/Authentication'

    constructor(private http: HttpClient) { }

    tryLogin$(loginRequest: LoginRequest) {
      return this.http.post<LoginResponse>(`${this.url}/Login`, loginRequest)
    }
  }