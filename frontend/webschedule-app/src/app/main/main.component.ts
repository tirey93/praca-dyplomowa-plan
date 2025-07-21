import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { WeekScheduleComponent } from "./week-schedule/week-schedule.component";
import { of, Subject, switchMap, takeUntil } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { SearchGroupComponent } from "../search-group/search-group.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserInGroupService } from '../../services/userInGroup/userInGroup.service';

@Component({
  selector: 'app-main',
  imports: [WeekScheduleComponent, SearchGroupComponent, MatProgressSpinnerModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy{
  userGroups: number[] = [];
  isLoading = true;
  noData = false;
  shouldShowGroupList: boolean = false;
  @Input() groupId?: number;

  private destroy$ = new Subject<void>();

  constructor(
    private loginService: LoginService,
    private userInGroupRepository: UserInGroupService,
    ) {

  }

  ngOnInit(): void {
    this.loginService.isLoggedIn$.pipe(
        takeUntil(this.destroy$),
        switchMap((isLogged) => isLogged ? this.userInGroupRepository.getByLoggedIn$() : of([])),
      ).subscribe({
        next: (userGroupResponses) => {
          this.userGroups = userGroupResponses.filter(x => !x.isCandidate).map(y => y.group.id)
          this.isLoading = false;
          this.shouldShowGroupList = this.groupId == undefined && this.userGroups && this.userGroups.length === 0
        },
        error: () => {
          this.noData = true;
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
