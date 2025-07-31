import { Component, inject } from '@angular/core';
import { UserGroupResponse } from '../../../../services/userInGroup/dtos/userGroupResponse';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GroupHelper } from '../../../../helpers/groupHelper';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectValue } from '../../../dtos/selectValue';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-activity-dialog',
  imports: [
    MatDialogModule, ReactiveFormsModule, MatTooltipModule, MatButtonModule
  ],
  templateUrl: './create-activity-dialog.component.html',
  styleUrl: './create-activity-dialog.component.scss'
})
export class CreateActivityDialogComponent {

  data = inject(DIALOG_DATA);
  userGroup: UserGroupResponse = this.data.userGroup;
  springSemester: boolean = this.isSpringSemester();


  activityForm = new FormGroup({
    name: new FormControl("", {validators: [Validators.required]}),
    teacherFullName: new FormControl("", {validators: [Validators.required]}),
    duration: new FormControl(2, {validators: [Validators.required]}),
    startingHour: new FormControl<SelectValue | null>(null),
    sessionNumber: new FormControl<SelectValue | null>(null),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateActivityDialogComponent>,
  ) {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  submit() {
    throw new Error('Method not implemented.');
  }
  getGroupName(userGroup: UserGroupResponse): string { return GroupHelper.groupInfoToString(userGroup.group)}

  private isSpringSemester(): boolean {
    return false;
  }
}

