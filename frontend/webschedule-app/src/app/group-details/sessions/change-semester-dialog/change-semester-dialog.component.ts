import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { UserGroupResponse } from '../../../../services/userInGroup/dtos/userGroupResponse';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

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


}
