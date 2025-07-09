import { Component, Input, OnInit } from '@angular/core';
import { UserResponse } from '../../../services/user/dtos/userResponse';
import { filter, Observable, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { UserRepositoryService } from '../../../services/user/userRepository.service';
import { GroupRepositoryService } from '../../../services/group/groupRepository.service';
import { LoginService } from '../../../services/login.service';
import { GroupHelper } from '../../../helpers/groupHelper';

@Component({
  selector: 'app-week-schedule',
  imports: [MatButtonModule],
  templateUrl: './week-schedule.component.html',
  styleUrl: './week-schedule.component.scss'
})
export class WeekScheduleComponent implements OnInit{
  @Input() groupName?: string;
  groupsToDisplay: string[] = []
  
  constructor(
    private groupRepository: GroupRepositoryService,
    private loginService: LoginService
  ) {
      
    }
  ngOnInit(): void {
    this.loginService.isLoggedIn$.pipe(
        filter(isLoggedIn => isLoggedIn && this.groupName == null),
        switchMap(x => this.groupRepository.getByLoggedIn$())
      ).subscribe(userGroupResponses => {
        const groupNames = userGroupResponses.map(x => GroupHelper.groupInfoToString(x))
        this.groupsToDisplay.push(...groupNames)
      });

      if (this.groupName)
        this.groupsToDisplay.push(this.groupName);
  }
}
