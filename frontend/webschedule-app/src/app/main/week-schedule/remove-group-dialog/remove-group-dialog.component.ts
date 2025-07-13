import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { UserGroupResponse } from '../../../../services/userInGroup/dtos/userGroupResponse';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GroupHelper } from '../../../../helpers/groupHelper';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserInGroupService } from '../../../../services/userInGroup/user-in-group.service';

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

  realMembersCount = 0;
  form = new FormGroup({
    membersCount: new FormControl(null, [Validators.required, this.equalToValidator()])
  })

  constructor(
    private dialogRef: MatDialogRef<RemoveGroupDialogComponent>,
    private userInGroupRepository: UserInGroupService
  ) {
    userInGroupRepository.geByGroup$(this.group.id).subscribe({
      next: (userGroupResponses) => {
        this.realMembersCount = userGroupResponses.length;
      }
    })
  }

  equalToValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      return value !== this.realMembersCount ? { notEqual: { actual: value, expected: this.realMembersCount } } : null;
    };
  }
  onNoClick() {
    this.dialogRef.close();
  }

  remove() {
    
  }

  getGroupName(group: UserGroupResponse): string { return GroupHelper.groupInfoToString(group)}
}
