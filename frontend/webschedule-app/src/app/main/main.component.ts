import { Component } from '@angular/core';
import { WeekScheduleComponent } from "./week-schedule/week-schedule.component";
import { Observable } from 'rxjs';
import { UserResponse } from '../../services/user/dtos/userResponse';
import { UserRepositoryService } from '../../services/user/userRepository.service';
import { AsyncPipe } from '@angular/common';
import { GroupChooserComponent } from "./group-chooser/group-chooser.component";

@Component({
  selector: 'app-main',
  imports: [WeekScheduleComponent, AsyncPipe, GroupChooserComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  loggedUser$: Observable<UserResponse>;
    
    constructor(
      private userRepositoryService: UserRepositoryService) {
        this.loggedUser$ = this.userRepositoryService.getLoggedIn$();
      }
}
