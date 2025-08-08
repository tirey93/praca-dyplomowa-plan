import { Component, Input, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateActivityDialogComponent } from './create-activity-dialog/create-activity-dialog.component';
import { UserGroupResponse } from '../../../services/userInGroup/dtos/userGroupResponse';
import { MatDividerModule } from '@angular/material/divider';
import { DividerComponent } from "../../divider/divider.component";
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { ActivityRepositoryService } from '../../../services/activity/activityRepository.service';
import { SyncService } from '../../../services/sync.service';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { UserInGroupService } from '../../../services/userInGroup/userInGroup.service';
import { ActivityInSessionResponse } from '../../../services/activity/dtos/activityInSessionResponse';
import { TranslatePipe } from '@ngx-translate/core';
import { WeekHelper } from '../../../helpers/weekHelper';
import { RemoveActivityDialogComponent } from './remove-activity-dialog/remove-activity-dialog.component';

@Component({
  selector: 'app-activities',
  imports: [
    MatButtonModule, MatTooltipModule, MatIconModule, MatDividerModule,
    DividerComponent, MatCardModule, MatChipsModule, MatButtonModule,
    MatIconModule, MatMenuModule, MatTooltipModule, TranslatePipe
],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent implements OnDestroy{
  userGroup?: UserGroupResponse
  activitiesInSessions: ActivityInSessionResponse[] = []
  private destroy$ = new Subject<void>();

  constructor(
    private readonly dialog: MatDialog,
    private activityService: ActivityRepositoryService,
    private userInGroupRepository: UserInGroupService,
    private syncService: SyncService
  ) {
    syncService.currentUserGroup$.pipe(
      takeUntil(this.destroy$),
      filter(userGroup => userGroup != null),
      switchMap((userGroup) => {
        this.userGroup = userGroup;
        return activityService.getByCurrentDate$(userGroup.group.id, userGroup.group.springSemester, 10);
      })
    ).subscribe({
      next: (activitiesInSessions) => {
        this.activitiesInSessions = activitiesInSessions;
      },
    })

    syncService.refreshActivities$.pipe(
      takeUntil(this.destroy$),
      switchMap(() => activityService.getByCurrentDate$(this.userGroup!.group.id, this.userGroup!.group.springSemester, 10))
    ).subscribe({
      next: (activitiesInSessions) => {
        this.activitiesInSessions = activitiesInSessions;
      },
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addActivity() {
    this.dialog.open(CreateActivityDialogComponent, {
      maxWidth: '50vw',
      autoFocus: false,
      data: {
        group: this.userGroup?.group,
        activityId: null,
        isAdmin: this.userGroup?.isAdmin
      },
    })
  }

  modifyActivity(activityId: number) {
    this.dialog.open(CreateActivityDialogComponent, {
      maxWidth: '50vw',
      autoFocus: false,
      data: {
        group: this.userGroup?.group,
        activityId: activityId,
        isAdmin: this.userGroup?.isAdmin
      },
    })
  }
  removeActivity(activityId: number) {
    this.dialog.open(RemoveActivityDialogComponent, {
      maxWidth: '50vw',
      autoFocus: false,
      data: {
        userGroup: this.userGroup,
        activityId: activityId
      },
    })
  }

  getDay(weekNumber: number, weekDay: string): string {
    return WeekHelper.getWeekendDay(WeekHelper.getSaturdayOfWeek(weekNumber), weekDay.toLowerCase() === "sunday");
  }
}
