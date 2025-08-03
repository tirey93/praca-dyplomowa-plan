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
import { MatSliderModule } from '@angular/material/slider';
import { ActivityRepositoryService } from '../../../../services/activity/activityRepository.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { combineLatest, debounceTime, filter, map, Observable, startWith, switchMap } from 'rxjs';
import { ActivityResponse } from '../../../../services/activity/dtos/activityResponse';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-activity-dialog',
  imports: [
    MatDialogModule, ReactiveFormsModule, MatTooltipModule, MatButtonModule,
     MatFormFieldModule, MatOptionModule, MatInputModule, MatSelectModule,
     MatSliderModule, MatChipsModule, MatDividerModule, AsyncPipe, CommonModule
  ],
  templateUrl: './create-activity-dialog.component.html',
  styleUrl: './create-activity-dialog.component.scss'
})
export class CreateActivityDialogComponent implements OnInit {
  data = inject(DIALOG_DATA);
  userGroup: UserGroupResponse = this.data.userGroup;
  allSessions: SelectValue[] = [];
  allHours: SelectValue[] = this.getAllHours();

  sessionsSelected: number[] = [];
  activitiesConflicted$: Observable<ActivityResponse[]>

  activityForm = new FormGroup({
    name: new FormControl("", {validators: [Validators.required]}),
    teacherFullName: new FormControl("", {validators: [Validators.required]}),
    duration: new FormControl(2, {validators: [Validators.required, Validators.min(1), Validators.max(6)]}),
    startingHour: new FormControl<SelectValue | null>(null),
    sessions: new FormControl<number[] | null>(null, [Validators.minLength(1), Validators.required])
  });

  constructor(
    private dialogRef: MatDialogRef<CreateActivityDialogComponent>,
    private sessionRepository: SessionService,
    private snackBarService: SnackBarService,
    private activityRepository: ActivityRepositoryService
  ) {
      this.activitiesConflicted$ = combineLatest([
        this.activityForm.controls.duration.valueChanges.pipe(startWith(this.activityForm.controls.duration.value)),
        this.activityForm.controls.startingHour.valueChanges.pipe(
          startWith(this.activityForm.controls.startingHour.value),
          map(value => (typeof value === 'object' && value !== null && 'id' in value ? (value as SelectValue).id : null))
        ),
        this.activityForm.controls.sessions.valueChanges.pipe(startWith(this.activityForm.controls.sessions.value)),
      ]).pipe(
        debounceTime(50),
        filter(([duration, startingHour, sessions]) => {
          const areApiParamsReady =
            duration !== null && duration !== undefined &&
            startingHour !== null && startingHour !== undefined && typeof startingHour === 'number' &&
            sessions !== null && sessions !== undefined && sessions.length > 0
          return areApiParamsReady;
        }),
        switchMap(([duration, startingHour, sessions]) => this.activityRepository.getConflicts$(
            this.userGroup.group.id,
            sessions!,
            this.userGroup.group.springSemester,
            startingHour!,
            duration! 
          )),
      );
  }

  ngOnInit(): void {
    this.sessionRepository.getByGroup$(this.userGroup.group.id).subscribe({
      next: (sessionsResponse) => {
        this.allSessions = sessionsResponse
          .filter(x => x.springSemester === this.userGroup.group.springSemester)
          .map(x => ({
            id: x.number,
            displayText: `${x.number.toString().padStart(2, '0')}`,
            additionalInfo: this.getPeriod(x.weekNumber)
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
    console.log(this.sessionsSelected);
    console.log(this.activityForm.controls.name.value);
    console.log(this.activityForm.controls.teacherFullName.value);
    console.log(this.activityForm.controls.startingHour.value);
    console.log(this.activityForm.controls.duration.value);
  }

  onSessionClicked(sessionNumber: number, selected: boolean) {
    this.sessionsSelected = this.sessionsSelected.filter(x => x !== sessionNumber);
    if (selected) {
      this.sessionsSelected.push(sessionNumber);
    }
    this.activityForm.get('sessions')?.setValue(this.sessionsSelected);
  }
  getGroupName(userGroup: UserGroupResponse): string { return GroupHelper.groupInfoToString(userGroup.group)}

  parseSessionNumber(sessionNumber: number): string {
    return sessionNumber.toString().padStart(2, '0') 
  }

  getEndHour(): string {
    if (this.activityForm.controls.startingHour.dirty){
      return this.getEndHourWithParams(
        this.activityForm.controls.duration.value!,
        this.activityForm.controls.startingHour.value?.id!
      )
    }
    return '';
  }

  getEndHourWithParams(duration: number, startingHour: number): string {
    const endHour = duration + startingHour;
    return this.formatHour(endHour);
  }
  getPeriod(weekNumber: number): string {
    return WeekHelper.getPeriod(WeekHelper.getSaturdayOfWeek(weekNumber))
  }
  formatHour(hour: number): string {
    return hour.toString().padStart(2, '0') + ':00';
  }

  private getAllHours(): SelectValue[] {
    const dayStart = 8;
    const dayEnd = 20;

    let currentHour = dayStart;
    const result: SelectValue[] = []
    for (dayStart; currentHour <= dayEnd; currentHour++) {
      result.push({
        id: currentHour,
        displayText: this.formatHour(currentHour)
      })
    }

    return result;
  }
}



