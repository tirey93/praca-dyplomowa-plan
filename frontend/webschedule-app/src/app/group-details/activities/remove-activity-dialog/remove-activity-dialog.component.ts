import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from '../../../../services/snackBarService';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { UserGroupResponse } from '../../../../services/userInGroup/dtos/userGroupResponse';
import { ActivityRepositoryService } from '../../../../services/activity/activityRepository.service';
import { ActivityResponse } from '../../../../services/activity/dtos/activityResponse';
import { WeekHelper } from '../../../../helpers/weekHelper';
import { TranslatePipe } from '@ngx-translate/core';
import { SyncService } from '../../../../services/sync.service';

@Component({
  selector: 'app-remove-activity-dialog',
  imports: [
    MatDialogModule, MatButtonModule, TranslatePipe
  ],
  templateUrl: './remove-activity-dialog.component.html',
  styleUrl: './remove-activity-dialog.component.scss'
})
export class RemoveActivityDialogComponent implements OnInit {
  data = inject(DIALOG_DATA);
  userGroup: UserGroupResponse = this.data.userGroup;
  activityId: number = this.data.activityId;
  activity?: ActivityResponse

  constructor(
    private dialogRef: MatDialogRef<RemoveActivityDialogComponent>,
    private snackBarService: SnackBarService,
    private activityRepository: ActivityRepositoryService,
    private syncService: SyncService
  ) {
  }

  ngOnInit(): void {
    this.activityRepository.getById$(this.activityId).subscribe({
      next: (activity) => {
        this.activity = activity;
      }, error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  onNoClick() {
    this.dialogRef.close();
  }

  remove() {
    this.activityRepository.delete$(this.activityId).subscribe({
      next: () => {
        this.syncService.refreshActivities$.next();
        this.snackBarService.openMessage('ActivityDeleted');
        this.dialogRef.close();
      },
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  getDay(weekNumber: number, weekDay: string): string {
    return WeekHelper.getWeekendDay(WeekHelper.getSaturdayOfWeek(weekNumber), weekDay.toLowerCase() === "sunday");
  }
}
