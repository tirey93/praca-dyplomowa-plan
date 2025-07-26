import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree} from '@angular/router';
import { LoginService } from '../../services/login.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService){};

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot):Observable<boolean | UrlTree> {
    this.loginService.refreshLogin();
    return this.loginService.isLoggedIn$.pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          return this.router.createUrlTree(['']);
        } else {
          return true;
        }
      })
    )
  }
  
}