import { Component, OnInit } from '@angular/core';
import { UserRepositoryService } from '../services/userRepository.service';
import { UserResponse } from '../login/dtos/userResponse';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common'; // Dodaj import
import { MatButtonModule } from '@angular/material/button';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-week-schedule',
  imports: [AsyncPipe, MatButtonModule],
  templateUrl: './week-schedule.component.html',
  styleUrl: './week-schedule.component.scss'
})
export class WeekScheduleComponent implements OnInit {

  constructor(
    private userRepositoryService: UserRepositoryService,
    private cookieService: CookieService,
    private router: Router  ) {}

  loggedUser$!: Observable<UserResponse>;
  ngOnInit(): void {
    this.loggedUser$ = this.userRepositoryService.getLoggedIn$();
  }

  logout() {
    this.cookieService.delete("token");
    this.cookieService.delete("backdoor");
    this.router.navigateByUrl("/login");
  }

}
