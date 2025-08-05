import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { GroupRepositoryService } from '../../../services/group/groupRepository.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SyncService } from '../../../services/sync.service';
import { filter, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserInGroupService } from '../../../services/userInGroup/userInGroup.service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { SessionService } from '../../../services/session/session.service';
import { SessionResponse } from '../../../services/session/dtos/sessionResponse';
import { SnackBarService } from '../../../services/snackBarService';
import { WeekHelper } from '../../../helpers/weekHelper';
import { GroupHelper } from '../../../helpers/groupHelper';
import { GroupResponse } from '../../../services/group/dtos/groupResponse';

@Component({
  selector: 'app-week-schedule',
  imports: [
    MatButtonModule, MatSidenavModule,
    MatTooltipModule, MatCardModule, MatDividerModule, MatIconModule
  ],
  templateUrl: './week-schedule.component.html',
  styleUrl: './week-schedule.component.scss'
})
export class WeekScheduleComponent implements OnInit, OnDestroy{
  @Input() userGroups: number[] = [];
  @Input() groupId?: number;
  sidenavOpened$: Observable<boolean>;

  groupsToDisplay: GroupResponse[] = []
  session?: SessionResponse;

  private destroy$ = new Subject<void>();
  
  constructor(
    private groupRepository: GroupRepositoryService,
    userInGroupRepository: UserInGroupService,
    private router: Router,
    private route: ActivatedRoute,
    private syncService: SyncService,
    private sessionRepository: SessionService,
    private snackBarService: SnackBarService
  ) {  
    this.sidenavOpened$ = syncService.groupSelected$;

    syncService.refreshGroups$.pipe(
      takeUntil(this.destroy$),
      switchMap(() => userInGroupRepository.getByLoggedIn$())
    ).subscribe({
      next: (userGroupsResponses) => {
        this.groupsToDisplay = userGroupsResponses
          .filter(x => !x.isCandidate)
          .map(x => x.group)
      }
    })
  }


  ngOnInit(): void {
    console.log(this.route.snapshot.queryParams);
    if (this.groupId) {
      this.groupRepository.isGroupExists$(this.groupId).pipe(
        switchMap((exist) => {
          if (exist) {
            return this.groupRepository.getGroupsById$([this.groupId!]);
          } else {
            this.router.navigateByUrl("");
            return of(null);
          }
        }),
        filter(session => session != null),
        switchMap((groups) => {
          this.groupsToDisplay = groups;
          return this.sessionRepository.getCurrent$(this.groupId!);
        })
      ) .subscribe({
        next: (session) => {
          this.session = session;
        },
        error: () => {
          this.router.navigateByUrl("");
        }
      })
    } else {
      this.groupRepository.getGroupsById$(this.userGroups).subscribe({
        next: (groups) => {
          this.groupsToDisplay = groups;
          // this.session = {
          //   number: 2,
          //   sessionId: 1,
          //   springSemester: false,
          //   weekNumber: 41
          // }
        }, 
        error: () => {
          this.router.navigateByUrl("");
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setNextSession() {
    if (!this.session)
      return;

    this.router.navigate([], { 
      queryParams: { session: this.session.number + 1 } 
    });
    this.sessionRepository.getNext$(this.session.sessionId).subscribe({
      next:(session) => {
        this.session = {...session};
      },
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  setPreviousSession() {
    if (!this.session)
      return;

    this.router.navigate([], { 
      queryParams: { session: this.session.number - 1 } 
    });
    this.sessionRepository.getPrevious$(this.session.sessionId).subscribe({
      next:(session) => {
        this.session = {...session};
      },
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  getPeriod(weekNumber: number): string {
    return WeekHelper.getPeriod(WeekHelper.getSaturdayOfWeek(weekNumber))
  }
  getGroupName(group: GroupResponse): string { return GroupHelper.groupInfoToString(group)}
}
