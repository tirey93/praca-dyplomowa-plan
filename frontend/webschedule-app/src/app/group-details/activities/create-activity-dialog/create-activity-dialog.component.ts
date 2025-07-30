import { Component, inject } from '@angular/core';
import { UserGroupResponse } from '../../../../services/userInGroup/dtos/userGroupResponse';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-create-activity-dialog',
  imports: [],
  templateUrl: './create-activity-dialog.component.html',
  styleUrl: './create-activity-dialog.component.scss'
})
export class CreateActivityDialogComponent {
  data = inject(DIALOG_DATA);
  userGroup: UserGroupResponse = this.data.userGroup;
}
