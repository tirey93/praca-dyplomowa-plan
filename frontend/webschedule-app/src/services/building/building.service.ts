import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../enviroments/enviroments';
import { BuildingResponse } from './dtos/buildingResponse';
import { BuildingRequest } from './dtos/buildingRequest';

@Injectable({
    providedIn: 'root'
  })
  export class BuildingService {
    protected url = `${environment.host}:${environment.port}/Building`

    constructor(private http: HttpClient, private cookieService: CookieService) { }


    get$() {
      return this.http.get<BuildingResponse[]>(`${this.url}`, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }
    create$(buildingRequest: BuildingRequest) {
      return this.http.post(`${this.url}`, buildingRequest, {
        headers: {
          authorization: `Bearer ${this.cookieService.get("token")}`
        }
      })
    }
  }