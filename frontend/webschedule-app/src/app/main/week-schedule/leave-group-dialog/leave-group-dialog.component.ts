import { Component, inject } from '@angular/core';
import { GroupSyncService } from '../../../../services/groupSync.service';
import { MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UserGroupResponse } from '../../../../services/userInGroup/dtos/userGroupResponse';
import { filter, map, Observable, switchMap } from 'rxjs';
import { GroupRepositoryService } from '../../../../services/group/groupRepository.service';
import { GroupHelper } from '../../../../helpers/groupHelper';
import { AsyncPipe } from '@angular/common';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { UserInGroupService } from '../../../../services/userInGroup/user-in-group.service';
import { SnackBarService } from '../../../../services/snackBarService';

@Component({
  selector: 'app-leave-group-dialog',
  imports: [
    MatDialogModule, MatButtonModule
  ],
  templateUrl: './leave-group-dialog.component.html',
  styleUrl: './leave-group-dialog.component.scss'
})
export class LeaveGroupDialogComponent {
  data = inject(DIALOG_DATA);
  userGroup: UserGroupResponse = this.data.userGroup;
  canLeave: boolean = true;

  constructor(
    private groupRepository: GroupRepositoryService,
    private userInGroupRepository: UserInGroupService,
    private dialogRef: MatDialogRef<LeaveGroupDialogComponent>,
    private snackBarService: SnackBarService
  ) {
    groupRepository.canLeaveGroup$(this.userGroup.group.id).subscribe({
      next: (canLeave) => {
        this.canLeave = canLeave
      }
    })
  }

  onNoClick() {
    this.dialogRef.close();
  }

  leave() {
    this.userInGroupRepository.disenrollFromGroup$({ groupId: this.userGroup.group.id }).subscribe({
      next: () => {
        this.snackBarService.openMessage('LeaveGroupSuccess');
        this.dialogRef.close();
      },
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  getGroupName(userGroup: UserGroupResponse): string { return GroupHelper.groupInfoToString(userGroup.group)}
}
