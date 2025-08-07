import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { GroupRepositoryService } from '../../../services/group/groupRepository.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SyncService } from '../../../services/sync.service';
import { filter, lastValueFrom, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
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
import { ActivityRepositoryService } from '../../../services/activity/activityRepository.service';
import { ActivityResponse } from '../../../services/activity/dtos/activityResponse';

interface Activity {
  id: number;
  name: string;
  position: number;
  duration: number;
  start: number;
}
interface Position {
  groupId: number;
  position: number;
}

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
  activities: ActivityResponse[] = []

  private destroy$ = new Subject<void>();
  
  constructor(
    private groupRepository: GroupRepositoryService,
    private userInGroupRepository: UserInGroupService,
    private router: Router,
    private route: ActivatedRoute,
    private syncService: SyncService,
    private sessionRepository: SessionService,
    private snackBarService: SnackBarService,
    private activityRepository: ActivityRepositoryService
  ) {  
    this.sidenavOpened$ = syncService.groupSelected$;

    syncService.refreshGroups$.pipe(
      takeUntil(this.destroy$),
      switchMap(() => userInGroupRepository.getByLoggedIn$()),
      switchMap(userInGroups => {
          this.groupsToDisplay = userInGroups
          .filter(x => !x.isCandidate)
          .map(x => x.group)
          return this.sessionRepository.getCurrentForLogged$()
        }),
      switchMap(session => {
          this.session = session;
          return this.activityRepository.getByWeek$(session.weekNumber, session.springSemester, this.groupsToDisplay.map(x => x.id))
        })
      ) .subscribe({
        next:(activities) => {
          this.activities = activities;
        },
        error: () => {
          this.router.navigateByUrl("");
        }
    })
  }


  ngOnInit(): void {
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
          if (this.route.snapshot.queryParams['sessionId']) {
            return this.sessionRepository.getById$(this.route.snapshot.queryParams['sessionId']);
          }
          return this.sessionRepository.getCurrent$(this.groupId!);
        }),
        switchMap(session => {
          this.session = session;
          return this.activityRepository.getByWeek$(session.weekNumber, session.springSemester, this.groupsToDisplay.map(x => x.id))
        })
      ) .subscribe({
        next:(activities) => {
          this.activities = activities;
        },
        error: () => {
          this.router.navigateByUrl("");
        }
      })
    } else {
      this.userInGroupRepository.getByLoggedIn$().pipe(
        switchMap(userInGroups => {
          this.groupsToDisplay = userInGroups
            .filter(x => !x.isCandidate)
            .map(x => x.group)
          if (this.route.snapshot.queryParams['sessionId']) {
            return this.sessionRepository.getById$(this.route.snapshot.queryParams['sessionId']);
          }
          return this.sessionRepository.getCurrentForLogged$()
        }),
        switchMap(session => {
          this.session = session
          return this.activityRepository.getByWeek$(session.weekNumber, session.springSemester, this.groupsToDisplay.map(x => x.id))
        })
      ).subscribe({
        next:(activities) => {
          this.activities = activities;
        },
        error: () => {
          this.syncService.refreshGroups$.next();
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

    this.sessionRepository
      .getNext$(this.session.number, this.session.weekNumber, this.session.springSemester, this.groupsToDisplay.map(x => x.id))
      .pipe(
        switchMap(session => {
          this.session = {...session};
          this.router.navigate([], { 
            queryParams: { sessionId: this.session.sessionId } 
          });
          return this.activityRepository.getByWeek$(session.weekNumber, session.springSemester, this.groupsToDisplay.map(x => x.id))
        })
      )
      .subscribe({
      next:(activities) => {
        this.activities = activities;
      },
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  setPreviousSession() {
    if (!this.session)
      return;

    this.sessionRepository
      .getPrevious$(this.session.number, this.session.weekNumber, this.session.springSemester, this.groupsToDisplay.map(x => x.id))
      .pipe(
        switchMap(session => {
          this.session = {...session};
          this.router.navigate([], { 
            queryParams: { sessionId: this.session.sessionId } 
          });
          return this.activityRepository.getByWeek$(session.weekNumber, session.springSemester, this.groupsToDisplay.map(x => x.id))
        })
      )
      .subscribe({
      next:(activities) => {
        this.activities = activities;
      },
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  get activitiesForSaturday(): Activity[] {
    return this.activities.filter(x => x.weekDay === 'Saturday').map(x => ({
      id: x.activityId,
      name: x.name,
      duration: x.duration,
      start: x.startingHour - 7,
      position: 3 - this.getPosition(x.session.groupId!)
    }) as Activity)
  }

  get activitiesForSunday(): Activity[] {
    return this.activities.filter(x => x.weekDay === 'Sunday').map(x => ({
      id: x.activityId,
      name: x.name,
      duration: x.duration,
      start: x.startingHour - 7,
      position: this.getPosition(x.session.groupId!)
    }) as Activity)
  }
  getPosition(groupId: number): number {
    return this.positions.find(p => p.groupId === groupId)?.position!;
  }
  get positions(): Position[] {
    return this.groupsToDisplay.map((x, index) => ({
      groupId: x.id,
      position: index
    }) as Position)
  }
  getPeriod(weekNumber: number): string {
    return WeekHelper.getPeriod(WeekHelper.getSaturdayOfWeek(weekNumber))
  }
  getGroupName(group: GroupResponse): string { return GroupHelper.groupInfoToString(group)}
}
