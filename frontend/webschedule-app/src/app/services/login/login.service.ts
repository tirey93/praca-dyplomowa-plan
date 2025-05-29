import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class LoginService {
    private helper = new JwtHelperService();
    private _isLoggedIn = new BehaviorSubject<boolean>(false);
    isLoggedIn$: Observable<boolean> = this._isLoggedIn.asObservable();

    constructor(private cookieService: CookieService) { }

    refreshLogin() {
      const token = this.cookieService.get("token");
      this._isLoggedIn.next(!this.helper.isTokenExpired(token))
    }

    login(token: string) {
      this.cookieService.set("token", token);
      this._isLoggedIn.next(true)
    }

    logout() {
      this.cookieService.delete("token");
      this._isLoggedIn.next(false)
    }
  }