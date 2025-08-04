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
import { MatRadioModule } from '@angular/material/radio';
import { SyncService } from '../../../../services/sync.service';
import { DividerComponent } from "../../../divider/divider.component";

@Component({
  selector: 'app-create-activity-dialog',
  imports: [
    MatDialogModule, ReactiveFormsModule, MatTooltipModule, MatButtonModule,
    MatFormFieldModule, MatOptionModule, MatInputModule, MatSelectModule,
    MatSliderModule, MatChipsModule, MatDividerModule, CommonModule,
    MatRadioModule,
    DividerComponent
],
  templateUrl: './create-activity-dialog.component.html',
  styleUrl: './create-activity-dialog.component.scss'
})
export class CreateActivityDialogComponent implements OnInit {
  data = inject(DIALOG_DATA);
  userGroup: UserGroupResponse = this.data.userGroup;
  allSessions: SelectValue[] = [];
  allHours: SelectValue[] = this.getAllHours();
  isLoading = false;

  sessionsSelected: number[] = [];
  activitiesConflicted: ActivityResponse[] = []

  activityForm = new FormGroup({
    name: new FormControl("", {validators: [Validators.required]}),
    teacherFullName: new FormControl("", {validators: [Validators.required]}),
    duration: new FormControl(2, {validators: [Validators.required, Validators.min(1), Validators.max(6)]}),
    startingHour: new FormControl<SelectValue | null>(null),
    sessions: new FormControl<number[] | null>(null, [Validators.minLength(1), Validators.required]),
    hasConflicts: new FormControl(false),
    weekDay: new FormControl("", [Validators.required])
  });

  constructor(
    private dialogRef: MatDialogRef<CreateActivityDialogComponent>,
    private sessionRepository: SessionService,
    private snackBarService: SnackBarService,
    private activityRepository: ActivityRepositoryService,
    private syncService: SyncService
  ) {
      combineLatest([
        this.activityForm.controls.duration.valueChanges.pipe(startWith(this.activityForm.controls.duration.value)),
        this.activityForm.controls.weekDay.valueChanges.pipe(startWith(this.activityForm.controls.weekDay.value)),
        this.activityForm.controls.startingHour.valueChanges.pipe(
          startWith(this.activityForm.controls.startingHour.value),
          map(value => (typeof value === 'object' && value !== null && 'id' in value ? (value as SelectValue).id : null))
        ),
        this.activityForm.controls.sessions.valueChanges.pipe(startWith(this.activityForm.controls.sessions.value)),
      ]).pipe(
        filter(([duration, weekDay, startingHour, sessions]) => {
          const areApiParamsReady =
            duration !== null && duration !== undefined &&
            weekDay !== null && weekDay !== undefined && weekDay.length > 0 &&
            startingHour !== null && startingHour !== undefined && typeof startingHour === 'number' &&
            sessions !== null && sessions !== undefined && sessions.length > 0
          return areApiParamsReady;
        }),
        switchMap(([duration, weekDay, startingHour, sessions]) => {
          this.isLoading = true;
          return this.activityRepository.getConflicts$(
            this.userGroup.group.id,
            sessions!,
            this.userGroup.group.springSemester,
            startingHour!,
            duration!,
            weekDay!
          )}),
        
      ).subscribe({
        next:(activities) => {
          this.activitiesConflicted = [...activities];
          if (activities.length > 0) {
            this.activityForm.setErrors({'incorrect': true});
          }
          this.isLoading = false;
        }
      });
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
    this.activityRepository.create$({ 
      groupId: this.userGroup.group.id!,
      name: this.activityForm.controls.name.value!,
      teacherFullName: this.activityForm.controls.teacherFullName.value!,
      sessionNumbers: this.sessionsSelected,
      weekDay: this.activityForm.controls.weekDay.value!,
      springSemester: this.userGroup.group.springSemester,
      startingHour: this.activityForm.controls.startingHour.value!.id,
      duration: this.activityForm.controls.duration.value!
    }).subscribe({
      next: () => {
        this.syncService.refreshActivities$.next();
        this.snackBarService.openMessage("ActivityCreated");
        this.dialogRef.close();
      },
      error: (err) => {
        this.snackBarService.openError(err);
        this.activityForm.setErrors({'incorrect': true})
      }
    })
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
  getDay(weekNumber: number, weekDay: string): string {
    return WeekHelper.getWeekendDay(WeekHelper.getSaturdayOfWeek(weekNumber), weekDay.toLowerCase() === "sunday");
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



