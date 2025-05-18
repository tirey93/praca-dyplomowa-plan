import { Component, OnInit } from '@angular/core';
import { UserRepositoryService } from '../services/user/userRepository.service';
import { UserResponse } from '../services/user/dtos/userResponse';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-week-schedule',
  imports: [AsyncPipe, MatButtonModule],
  templateUrl: './week-schedule.component.html',
  styleUrl: './week-schedule.component.scss'
})
export class WeekScheduleComponent {
  loggedUser$: Observable<UserResponse>;
  
  constructor(
    private userRepositoryService: UserRepositoryService) {
      this.loggedUser$ = this.userRepositoryService.getLoggedIn$();
    }
}
