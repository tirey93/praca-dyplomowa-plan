import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { WeekScheduleComponent } from "./week-schedule/week-schedule.component";
import { BehaviorSubject, catchError, combineLatest, filter, finalize, lastValueFrom, map, merge, Observable, of, pipe, skip, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { SearchGroupComponent } from "../search-group/search-group.component";
import { GroupRepositoryService } from '../../services/group/groupRepository.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-main',
  imports: [WeekScheduleComponent, SearchGroupComponent, MatProgressSpinnerModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy{
  userGroups: number[] = [];
  isLoading = true;
  shouldShowGroupList: boolean = false;
  @Input() groupId?: number;

  private destroy$ = new Subject<void>();

  constructor(
    private loginService: LoginService,
    private groupRepository: GroupRepositoryService
    ) {

  }

  ngOnInit(): void {
    this.loginService.isLoggedIn$.pipe(
        takeUntil(this.destroy$),
        switchMap((isLogged) => isLogged ? this.groupRepository.getByLoggedIn$() : of([])),
      ).subscribe({
        next: (userGroupResponses) => {
          this.userGroups = userGroupResponses.map(y => y.id)
          this.isLoading = false;
          this.shouldShowGroupList = this.groupId == undefined && this.userGroups && this.userGroups.length === 0
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
