import { Component, inject } from '@angular/core';
import { SidenavService } from '../../../../services/sidenav.service';
import { MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UserGroupResponse } from '../../../../services/group/dtos/userGroupResponse';
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
    MatDialogModule, MatButtonModule, AsyncPipe
  ],
  templateUrl: './leave-group-dialog.component.html',
  styleUrl: './leave-group-dialog.component.scss'
})
export class LeaveGroupDialogComponent {
  data = inject(DIALOG_DATA);
  group: UserGroupResponse = this.data.group;
  canLeave$: Observable<boolean>;

  constructor(
    private groupRepository: GroupRepositoryService,
    private userInGroupRepository: UserInGroupService,
    private dialogRef: MatDialogRef<LeaveGroupDialogComponent>,
    private snackBarService: SnackBarService
  ) {
    this.canLeave$ = groupRepository.canLeaveGroup$(this.group.id)
  }

  onNoClick() {
    this.dialogRef.close();
  }

  leave() {
    this.userInGroupRepository.disenrollFromGroup$({ groupId: this.group.id }).subscribe({
      next: () => {
        this.snackBarService.openMessage('LeaveGroupSuccess');
        this.dialogRef.close();
      },
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  getGroupName(group: UserGroupResponse): string { return GroupHelper.groupInfoToString(group)}
}
