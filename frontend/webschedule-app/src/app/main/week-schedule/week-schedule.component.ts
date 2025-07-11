import { Component, Input, OnInit } from '@angular/core';
import { UserResponse } from '../../../services/user/dtos/userResponse';
import { combineLatest, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { UserRepositoryService } from '../../../services/user/userRepository.service';
import { GroupRepositoryService } from '../../../services/group/groupRepository.service';
import { LoginService } from '../../../services/login.service';
import { GroupHelper } from '../../../helpers/groupHelper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-week-schedule',
  imports: [MatButtonModule],
  templateUrl: './week-schedule.component.html',
  styleUrl: './week-schedule.component.scss'
})
export class WeekScheduleComponent implements OnInit{
  @Input() userGroups: number[] = [];
  @Input() groupId?: number;

  groupsToDisplay: number[] = []
  constructor(
    private groupRepository: GroupRepositoryService,
    private router: Router,
  ) {  
    
  }

  ngOnInit(): void {
    if (this.groupId) {
      this.groupRepository.isGroupExists$(this.groupId).subscribe({
        next: (exist) => {
          if (exist) {
            this.groupsToDisplay = [this.groupId!]
          } else {
            this.router.navigateByUrl("");
          }
        },
        error: () => {
          this.router.navigateByUrl("");
        }
      })
    } else {
      this.groupsToDisplay = [...this.userGroups]
    }
  }
}
