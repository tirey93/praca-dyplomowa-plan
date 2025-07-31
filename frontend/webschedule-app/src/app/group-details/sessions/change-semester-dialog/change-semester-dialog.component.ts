import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { UserGroupResponse } from '../../../../services/userInGroup/dtos/userGroupResponse';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GroupRepositoryService } from '../../../../services/group/groupRepository.service';
import { SnackBarService } from '../../../../services/snackBarService';

@Component({
  selector: 'app-change-semester-dialog',
  imports: [
    MatDialogModule, MatButtonModule
  ],
  templateUrl: './change-semester-dialog.component.html',
  styleUrl: './change-semester-dialog.component.scss'
})
export class ChangeSemesterDialogComponent {

  data = inject(DIALOG_DATA);
  userGroup: UserGroupResponse = this.data.userGroup;
  springSemester: boolean = this.data.springSemester;

  constructor(
    private dialogRef: MatDialogRef<ChangeSemesterDialogComponent>,
    private groupRepository: GroupRepositoryService,
    private snackBarService: SnackBarService
  ) {
  }

  onNoClick() {
    this.dialogRef.close(false);
  }

  change() {
    this.groupRepository.updateSemester$({ groupId: this.userGroup.group.id!, springSemester: !this.springSemester }).subscribe({
      next: () => {
        this.snackBarService.openMessage('SemesterUpdated');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }
}
