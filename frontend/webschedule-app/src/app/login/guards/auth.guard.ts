import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { JwtService } from '../../services/jwt.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private jwtService: JwtService){};

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot):boolean {
    if (!this.jwtService.isTokenValid()) {
      this.router.navigateByUrl("/login")
      return false;
    }
    return true;
  }
  
}