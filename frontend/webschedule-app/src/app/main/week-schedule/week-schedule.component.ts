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
  imports: [MatButtonModule, AsyncPipe],
  templateUrl: './week-schedule.component.html',
  styleUrl: './week-schedule.component.scss'
})
export class WeekScheduleComponent implements OnInit{
  @Input() loggedUser$: Observable<boolean> = of(false);
  @Input() userGroups$: Observable<number[]> = of([]);
  @Input() groupFromUrl$: Observable<number | null> = of(null);
    
  group:number | null = null;
  constructor(
    private groupRepository: GroupRepositoryService,
    private loginService: LoginService
  ) {  
    
  }

  ngOnInit(): void {
    combineLatest([
      this.loggedUser$,
      this.groupFromUrl$,
      this.userGroups$,
    ]).subscribe({
      next: ([isLoggedIn, groupFromUrl, userGroups]) => {
        console.log('week', isLoggedIn, groupFromUrl, userGroups)
        this.group = groupFromUrl;
      }
    })
  }
}
