import { Component, inject, OnInit } from '@angular/core';
import { UserGroupResponse } from '../../../../services/userInGroup/dtos/userGroupResponse';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GroupHelper } from '../../../../helpers/groupHelper';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectValue } from '../../../dtos/selectValue';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { SessionService } from '../../../../services/session/session.service';
import { SnackBarService } from '../../../../services/snackBarService';
import { WeekHelper } from '../../../../helpers/weekHelper';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-activity-dialog',
  imports: [
    MatDialogModule, ReactiveFormsModule, MatTooltipModule, MatButtonModule,
     MatFormFieldModule, MatOptionModule, MatInputModule, MatSelectModule
  ],
  templateUrl: './create-activity-dialog.component.html',
  styleUrl: './create-activity-dialog.component.scss'
})
export class CreateActivityDialogComponent implements OnInit {
  data = inject(DIALOG_DATA);
  userGroup: UserGroupResponse = this.data.userGroup;
  allSessions: SelectValue[] = [];

  activityForm = new FormGroup({
    name: new FormControl("", {validators: [Validators.required]}),
    teacherFullName: new FormControl("", {validators: [Validators.required]}),
    duration: new FormControl(2, {validators: [Validators.required, Validators.min(1), Validators.max(6)]}),
    startingHour: new FormControl<SelectValue | null>(null),
    sessionNumber: new FormControl<SelectValue | null>(null),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateActivityDialogComponent>,
    private sessionRepository: SessionService,
    private snackBarService: SnackBarService
  ) {
  }

  ngOnInit(): void {
    this.sessionRepository.getByGroup$(this.userGroup.group.id).subscribe({
      next: (sessionsResponse) => {
        this.allSessions = sessionsResponse
          .filter(x => x.springSemester === this.userGroup.group.springSemester)
          .map(x => ({
            id: x.number,
            displayText: `${x.number.toString().padStart(2, '0')}: ${this.getPeriod(x.weekNumber)}`
          }) as SelectValue)
      }, error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  onNoClick() {
    this.dialogRef.close();
  }

  submit() {
    console.log(this.activityForm.controls.sessionNumber.value);
    console.log(this.activityForm.controls.name.value);
    console.log(this.activityForm.controls.teacherFullName.value);
  }
  getGroupName(userGroup: UserGroupResponse): string { return GroupHelper.groupInfoToString(userGroup.group)}

  private getPeriod(weekNumber: number): string {
    return WeekHelper.getPeriod(WeekHelper.getSaturdayOfWeek(weekNumber))
  }
}



