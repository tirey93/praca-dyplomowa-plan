import { Component, OnInit } from '@angular/core';
import { UserRepositoryService } from '../services/UserRepository.service';
import { UserResponse } from '../login/dtos/userResponse';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common'; // Dodaj import


@Component({
  selector: 'app-week-schedule',
  imports: [AsyncPipe],
  templateUrl: './week-schedule.component.html',
  styleUrl: './week-schedule.component.scss'
})
export class WeekScheduleComponent implements OnInit {
  constructor(
    private userRepositoryService: UserRepositoryService) {}

  loggedUser$!: Observable<UserResponse>;
  ngOnInit(): void {
    this.loggedUser$ = this.userRepositoryService.getLoggedIn$();
  }

}
