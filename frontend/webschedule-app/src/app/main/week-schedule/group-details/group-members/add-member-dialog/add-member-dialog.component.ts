import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { UserGroupResponse } from '../../../../../../services/userInGroup/dtos/userGroupResponse';

@Component({
  selector: 'app-add-member-dialog',
  imports: [],
  templateUrl: './add-member-dialog.component.html',
  styleUrl: './add-member-dialog.component.scss'
})
export class AddMemberDialogComponent {
  data = inject(DIALOG_DATA);
  userGroup: UserGroupResponse = this.data.userGroup;

  
}
