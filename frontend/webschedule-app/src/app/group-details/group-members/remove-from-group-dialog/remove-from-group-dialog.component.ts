import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { GroupHelper } from '../../../../helpers/groupHelper';
import { SnackBarService } from '../../../../services/snackBarService';
import { UserGroupResponse } from '../../../../services/userInGroup/dtos/userGroupResponse';
import { UserInGroupService } from '../../../../services/userInGroup/userInGroup.service';

@Component({
  selector: 'app-remove-from-group-dialog',
  imports: [
    MatDialogModule, MatButtonModule
  ],
  templateUrl: './remove-from-group-dialog.component.html',
  styleUrl: './remove-from-group-dialog.component.scss'
})
export class RemoveFromGroupDialogComponent {
  data = inject(DIALOG_DATA);
  userGroup: UserGroupResponse = this.data.userGroup;

  constructor(
    private userInGroupRepository: UserInGroupService,
    private dialogRef: MatDialogRef<RemoveFromGroupDialogComponent>,
    private snackBarService: SnackBarService
  ) {
  }

  onNoClick() {
    this.dialogRef.close(false);
  }

  remove() {
    this.userInGroupRepository.disenrollFromGroup$({ groupId: this.userGroup.group.id, userId: this.userGroup.user.id }).subscribe({
      next: () => {
        this.snackBarService.openMessage('RemoveUserFromGroupSuccess');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  getGroupName(userGroup: UserGroupResponse): string { return GroupHelper.groupInfoToString(userGroup.group)}
}
