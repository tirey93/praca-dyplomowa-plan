import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { UserGroupResponse } from '../../../../services/userInGroup/dtos/userGroupResponse';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GroupHelper } from '../../../../helpers/groupHelper';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-remove-group-dialog',
  imports: [
    MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatLabel, MatInputModule
  ],
  templateUrl: './remove-group-dialog.component.html',
  styleUrl: './remove-group-dialog.component.scss'
})
export class RemoveGroupDialogComponent {
  data = inject(DIALOG_DATA);
  group: UserGroupResponse = this.data.group;

  form = new FormGroup({
    membersCount: new FormControl()
  })

  constructor(
    private dialogRef: MatDialogRef<RemoveGroupDialogComponent>,
  ) {
    
  }

  onNoClick() {
    this.dialogRef.close();
  }

  remove() {
    
  }

  getGroupName(group: UserGroupResponse): string { return GroupHelper.groupInfoToString(group)}
}
