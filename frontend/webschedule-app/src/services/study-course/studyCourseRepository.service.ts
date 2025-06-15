import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../enviroments/enviroments';
import { StudyCourseResponse } from './dtos/studyCourseResponse';
import { StudyCourseRequest } from './dtos/studyCourseRequest';

@Injectable({
    providedIn: 'root'
  })
  export class StudyCourseRepository {
    protected url = `${environment.host}:${environment.port}/StudyCourse`

    constructor(private http: HttpClient, private cookieService: CookieService) { }


    get$() {
      return this.http.get<StudyCourseResponse[]>(`${this.url}`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }
    create$(studyCourseRequest: StudyCourseRequest) {
      return this.http.post<StudyCourseResponse>(`${this.url}`, studyCourseRequest, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }
  }