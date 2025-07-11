import { Component, Input, OnInit } from '@angular/core';
import { UserResponse } from '../../../services/user/dtos/userResponse';
import { combineLatest, filter, map, Observable, of, switchMap, tap } from 'rxjs';
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
  @Input() userGroups: number[] = [];
  @Input() groupId?: number;

  groupsToDisplay: number[] = []
  constructor(
  ) {  
    
  }

  ngOnInit(): void {
    this.groupsToDisplay = this.groupId ? [this.groupId] : [...this.userGroups];    
  }
}
