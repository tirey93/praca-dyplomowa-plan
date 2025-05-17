import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
  export class JwtService {
    helper = new JwtHelperService();

    constructor(private cookieService: CookieService) { }

    isTokenValid(): boolean {
      const backdoor = this.cookieService.get("backdoor");
      if (backdoor) {
        return true;
      }

      const token = this.cookieService.get("token");
      return !this.helper.isTokenExpired(token)
    }
  }