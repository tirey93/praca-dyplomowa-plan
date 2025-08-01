import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from './dtos/loginRequest';
import { LoginResponse } from './dtos/loginResponse';
import { environment } from '../../enviroments/enviroments';
import { RegisterRequest } from './dtos/registerRequest';

@Injectable({
    providedIn: 'root'
  })
  export class AuthenticationRepositoryService {
    protected url = `${environment.host}:${environment.port}/Authentication`

    constructor(private http: HttpClient) { }

    tryLogin$(loginRequest: LoginRequest) {
      return this.http.post<LoginResponse>(`${this.url}/Login`, loginRequest)
    }

    register$(registerRequest: RegisterRequest) {
      return this.http.post(`${this.url}/Register`, registerRequest)
    }
  }