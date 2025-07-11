import { Component, Input, OnInit } from '@angular/core';
import { WeekScheduleComponent } from "./week-schedule/week-schedule.component";
import { BehaviorSubject, catchError, combineLatest, filter, finalize, map, merge, Observable, of, pipe, skip, startWith, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { SearchGroupComponent } from "../search-group/search-group.component";
import { GroupRepositoryService } from '../../services/group/groupRepository.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-main',
  imports: [WeekScheduleComponent, AsyncPipe, SearchGroupComponent, MatProgressSpinnerModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit{
  userGroups$: Observable<number[]>;
  isLoading$: Observable<boolean>;
  shouldShowGroupList$: Observable<boolean> = of(false);
  @Input() groupId?: number;

  constructor(
    loginService: LoginService,
    groupRepository: GroupRepositoryService
    ) {
      const loggedUser$ = loginService.isLoggedIn$;
      this.userGroups$ = loggedUser$.pipe(
        filter(isLoggedIn => isLoggedIn),
        switchMap(x => 
          groupRepository.getByLoggedIn$().pipe(
            map(userGroupResponse => userGroupResponse.map(y => y.id)),
          )
        ),
        startWith([]),
      );
      this.isLoading$ = merge(
        // Emituj true gdy zaczyna się ładowanie
        loggedUser$.pipe(
          map(() => false)
        ),
        // Emituj false gdy ładowanie się zakończy
        this.userGroups$.pipe(
          map(() => false)
        )
      ).pipe(
        startWith(true) // Początkowy stan
      );
  }
  ngOnInit(): void {
    this.shouldShowGroupList$ = this.isLoading$.pipe(
      switchMap((loading) => {
        if (!loading) {
          return this.userGroups$.pipe(
            map((userGroups) => {
              return this.groupId == undefined && userGroups.length === 0
            }),
          )
        }
        return of(false)
      })
    );
  }
}
