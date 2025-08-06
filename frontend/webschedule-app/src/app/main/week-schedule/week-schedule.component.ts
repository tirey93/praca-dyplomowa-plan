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
  @Input() groupId?: number;
  sidenavOpened$: Observable<boolean>;

  groupsToDisplay: GroupResponse[] = []
  session?: SessionResponse;

  private destroy$ = new Subject<void>();
  
  constructor(
    private groupRepository: GroupRepositoryService,
    private userInGroupRepository: UserInGroupService,
    private router: Router,
    private route: ActivatedRoute,
    private syncService: SyncService,
    private sessionRepository: SessionService,
    private snackBarService: SnackBarService
  ) {  
    this.sidenavOpened$ = syncService.groupSelected$;

    syncService.refreshGroups$.pipe(
      takeUntil(this.destroy$),
      switchMap(() => userInGroupRepository.getByLoggedIn$()),
      switchMap(userInGroups => {
          console.log('in sync');
          this.groupsToDisplay = userInGroups
          .filter(x => !x.isCandidate)
          .map(x => x.group)
          return this.sessionRepository.getCurrentForLogged$()
        })
    ).subscribe({
      next: (session) => {
          this.session = session
        }, 
        error: () => {
          this.router.navigateByUrl("");
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
          console.log('session', this.session);
          console.log('groupsToDisplay', this.groupsToDisplay);
        },
        error: () => {
          this.router.navigateByUrl("");
        }
      })
    } else {
      this.userInGroupRepository.getByLoggedIn$().pipe(
        switchMap(userInGroups => {
          console.log('in else');
          this.groupsToDisplay = userInGroups
            .filter(x => !x.isCandidate)
            .map(x => x.group)
          return this.sessionRepository.getCurrentForLogged$()
        })
      ).subscribe({
        next: (session) => {
          this.session = session
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

    this.sessionRepository.getNext$(this.session.number, this.session.weekNumber, this.session.springSemester, this.groupsToDisplay.map(x => x.id)).subscribe({
      next:(session) => {
        this.session = {...session};
        console.log('session', this.session);
        this.router.navigate([], { 
          queryParams: { session: this.session.number, spring: this.session.springSemester } 
        });
      },
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  setPreviousSession() {
    if (!this.session)
      return;

    this.sessionRepository.getPrevious$(this.session.number, this.session.weekNumber, this.session.springSemester, this.groupsToDisplay.map(x => x.id)).subscribe({
      next:(session) => {
        this.session = {...session};
        console.log('session', this.session);
        this.router.navigate([], { 
          queryParams: { session: this.session.number, spring: this.session.springSemester } 
        });
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
