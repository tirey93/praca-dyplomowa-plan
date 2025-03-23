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
        const token = this.cookieService.get("token");
        return !this.helper.isTokenExpired(token)
    }

    hasAdminRights(): boolean {
        const token = this.cookieService.get("token");
        const decodedToken = this.helper.decodeToken(token);
        return !this.helper.isTokenExpired(token) 
            && decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === "Admin"
    }
  }