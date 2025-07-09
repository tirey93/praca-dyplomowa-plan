import { Component, Input, OnInit } from '@angular/core';
import { WeekScheduleComponent } from "./week-schedule/week-schedule.component";
import { catchError, combineLatest, filter, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { SearchGroupComponent } from "../search-group/search-group.component";
import { GroupRepositoryService } from '../../services/group/groupRepository.service';

@Component({
  selector: 'app-main',
  imports: [WeekScheduleComponent, AsyncPipe, SearchGroupComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit{
  loggedUser$: Observable<boolean>;
  userGroups$: Observable<number[]>;
  groupFromUrl$: Observable<number | null> = of(null);

  shouldShowGroupList$!: Observable<boolean>;
  @Input() groupId?: number;

  constructor(
    loginService: LoginService,
    private groupRepository: GroupRepositoryService
    ) {
      this.loggedUser$ = loginService.isLoggedIn$;
      this.userGroups$ = this.loggedUser$.pipe(
        filter(isLoggedIn => isLoggedIn),
        switchMap(x => 
          groupRepository.getByLoggedIn$().pipe(
            map(userGroupResponse => userGroupResponse.map(y => y.id))
          )
        ),
      );
  }
  ngOnInit(): void {
    this.groupFromUrl$ = this.groupRepository.getById$(this.groupId).pipe(
      map(userGroupResponse => userGroupResponse.id),
      catchError(() => of(null)),
    )

    this.shouldShowGroupList$ = combineLatest([
          this.loggedUser$.pipe(startWith(false)),
          this.groupFromUrl$.pipe(startWith(null)),
          this.userGroups$.pipe(startWith([])),
      ]).pipe(
        tap(([isLoggedIn, groupFromUrl, userGroups]) => console.log('main', isLoggedIn, groupFromUrl, userGroups)),
        map(([isLoggedIn, groupFromUrl, userGroups]) => {
          return groupFromUrl == null && (!isLoggedIn || (isLoggedIn && userGroups.length === 0))
        })
      );
  }
}
