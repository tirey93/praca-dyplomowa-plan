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
  @Input() userGroups$!: Observable<number[]>;
  @Input() groupFromUrl$!: Observable<number | null>;
    
  groupsToDisplay$: Observable<number[]> = of([])
  constructor(
    private groupRepository: GroupRepositoryService,
    private loginService: LoginService
  ) {  
    
  }

  ngOnInit(): void {
    this.groupsToDisplay$ = combineLatest([
      this.groupFromUrl$,
      this.userGroups$,
    ]).pipe(
      map(([groupFromUrl, userGroups]) => {
          if (groupFromUrl) {
            return [groupFromUrl];
          }
          return [...userGroups];
        })
    )

    // this.groupsToDisplay$ = combineLatest([
    //   this.loggedUser$,
    //   this.groupFromUrl$,
    //   this.userGroups$,
    // ]).pipe(
    //   tap(([isLoggedIn, groupFromUrl, userGroups]) => console.log('week', isLoggedIn, groupFromUrl, userGroups)),
    //   map(([isLoggedIn, groupFromUrl, userGroups]) => {
    //       if (isLoggedIn) {
    //         if (groupFromUrl) {
    //           return [groupFromUrl];
    //         } else {
    //           return [...userGroups];
    //         }
    //       } else {
    //         if (groupFromUrl) {
    //           return [groupFromUrl];
    //         }
    //       }
    //       return [];
    //     })
    // )
  }
}
