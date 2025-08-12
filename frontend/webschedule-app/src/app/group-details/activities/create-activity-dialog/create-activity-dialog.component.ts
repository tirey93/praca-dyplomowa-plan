import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { combineLatest, debounceTime, filter, map, Observable, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { ActivityResponse } from '../../../../services/activity/dtos/activityResponse';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { SyncService } from '../../../../services/sync.service';
import { DividerComponent } from "../../../divider/divider.component";
import { GroupResponse } from '../../../../services/group/dtos/groupResponse';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BuildingService } from '../../../../services/building/building.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-activity-dialog',
  imports: [
    MatDialogModule, ReactiveFormsModule, MatTooltipModule, MatButtonModule,
    MatFormFieldModule, MatOptionModule, MatInputModule, MatSelectModule,
    MatSliderModule, MatChipsModule, MatDividerModule, CommonModule,
    MatRadioModule, MatCheckboxModule, MatAutocompleteModule, AsyncPipe,
    DividerComponent, MatIconModule
],
  templateUrl: './create-activity-dialog.component.html',
  styleUrl: './create-activity-dialog.component.scss'
})
export class CreateActivityDialogComponent implements OnInit, OnDestroy {
  data = inject(DIALOG_DATA);
  group: GroupResponse = this.data.group;
  activityId: number | null = this.data.activityId;
  isAdmin: boolean = this.data.isAdmin;
  activity: ActivityResponse | null = null;
  allSessions: SelectValue[] = [];
  allHours: number[] = this.getAllHours();
  isLoading = false;

  sessionsSelected: number[] = [];
  activitiesConflicted: ActivityResponse[] = []

  private destroy$ = new Subject<void>();

  filteredOptionsBuilding$: Observable<SelectValue[]>;
  allBuildings: SelectValue[] = [];
  activityForm = new FormGroup({
    name: new FormControl("", {validators: [Validators.required]}),
    teacherFullName: new FormControl("", {validators: [Validators.required]}),
    room: new FormControl("", {validators: [Validators.required]}),
    duration: new FormControl(2, {validators: [Validators.required, Validators.min(1), Validators.max(6)]}),
    startingHour: new FormControl<number | null>(null),
    endingHour: new FormControl<SelectValue | null>(null),
    sessions: new FormControl<number[] | null>(null, [Validators.minLength(1), Validators.required]),
    hasConflicts: new FormControl(false),
    isRemote: new FormControl(false),
    weekDay: new FormControl("", [Validators.required]),
    building: new FormControl<SelectValue | null>(null, {validators: [Validators.required]}),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateActivityDialogComponent>,
    private sessionRepository: SessionService,
    private snackBarService: SnackBarService,
    private activityRepository: ActivityRepositoryService,
    private syncService: SyncService,
    private buildingService: BuildingService
  ) {
      this.updateBuildings(null);
      this.filteredOptionsBuilding$ = this.activityForm.controls.building.valueChanges.pipe(
        map((value) => {
          if (!this.allBuildings) {
            return [];
          }
          const filterValue = (typeof value === 'string' ? value : value?.displayText || '').toLowerCase();
          
          if (!filterValue.trim()) {
            return this.allBuildings.slice();
          }
          return this.allBuildings.filter(building => building.displayText.toLowerCase().includes(filterValue));
        }),
      );

      combineLatest([
        this.activityForm.controls.duration.valueChanges.pipe(startWith(this.activityForm.controls.duration.value)),
        this.activityForm.controls.weekDay.valueChanges.pipe(startWith(this.activityForm.controls.weekDay.value)),
        this.activityForm.controls.startingHour.valueChanges.pipe(startWith(this.activityForm.controls.startingHour.value)),
        this.activityForm.controls.sessions.valueChanges.pipe(startWith(this.activityForm.controls.sessions.value)),
      ]).pipe(
        filter(([duration, weekDay, startingHour, sessions]) => {
          this.isLoading = true;
          const areApiParamsReady =
            duration !== null && duration !== undefined &&
            weekDay !== null && weekDay !== undefined && weekDay.length > 0 &&
            startingHour !== null && startingHour !== undefined &&
            sessions !== null && sessions !== undefined && sessions.length > 0
          const result = areApiParamsReady && !this.activityForm.pristine;
          return result;
        }),
        switchMap(([duration, weekDay, startingHour, sessions]) => {
          return this.activityRepository.getConflicts$(
            this.group.id,
            sessions!,
            this.group.springSemester,
            startingHour!,
            duration!,
            weekDay!
          )}),
        
      ).subscribe({
        next:(activities) => {
          if (this.activityId) {
            activities = activities.filter(x => x.activityId !== this.activityId)
          }
          this.activitiesConflicted = [...activities];
          if (activities.length > 0) {
            this.activityForm.setErrors({'incorrect': true});
          }
          this.isLoading = false;
        }
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.activityForm.controls.isRemote.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (isRemote) => {
        if (isRemote) {
          this.activityForm.controls.room.clearValidators();
          this.activityForm.controls.room.setValue(null);
          this.activityForm.controls.building.clearValidators();
          this.activityForm.controls.building.setValue(null);
        } else {
          this.activityForm.controls.room.addValidators([Validators.required]);
          this.activityForm.controls.building.addValidators([Validators.required]);
        }
        this.activityForm.controls.room.updateValueAndValidity();
        this.activityForm.controls.building.updateValueAndValidity();
        this.updateBuildings(null);
      }
    })

    this.sessionRepository.getByGroup$(this.group.id).subscribe({
      next: (sessionsResponse) => {
        this.allSessions = sessionsResponse
          .filter(x => x.springSemester === this.group.springSemester)
          .map(x => ({
            id: x.number,
            displayText: `${x.number.toString().padStart(2, '0')}`,
            additionalInfo: this.getPeriod(x.weekNumber)
          }) as SelectValue)
      }, error: (err) => {
        this.snackBarService.openError(err);
      }
    })

    if(this.activityId) {
      this.isLoading = true;
      this.activityRepository.getById$(this.activityId).subscribe({
        next: (activity) => {
          this.activity = activity;
          this.activityForm.controls.name.setValue(activity.name);
          this.activityForm.controls.teacherFullName.setValue(activity.teacherFullName);
          this.activityForm.controls.room.setValue(activity.room);
          this.activityForm.controls.weekDay.setValue(activity.weekDay.toLowerCase());
          this.activityForm.controls.startingHour.setValue(activity.startingHour);
          this.activityForm.controls.duration.setValue(activity.duration);
          if (activity.building) {
            this.activityForm.controls.isRemote.setValue(false);
            this.updateBuildings({ id: activity.building.buildingId, displayText: activity.building.name });
          } else {
            this.activityForm.controls.isRemote.setValue(true);
          }
          this.isLoading = false;
          this.activityForm.setErrors({'incorrect': true})
        }, error: (err) => {
          this.snackBarService.openError(err);
        }
      })
    }
    if (!this.isAdmin){
      this.activityForm.controls.name.disable();
      this.activityForm.controls.name.disable();
      this.activityForm.controls.teacherFullName.disable();
      this.activityForm.controls.room.disable();
      this.activityForm.controls.building.disable();
      this.activityForm.controls.isRemote.disable();
      this.activityForm.controls.weekDay.disable();
      this.activityForm.controls.startingHour.disable();
      this.activityForm.controls.duration.disable();
    }

  }

  onNoClick() {
    this.dialogRef.close();
  }

  submit() {
    const building = this.activityForm.controls.building.value;
    if (this.activityId) {
      this.activityRepository.update$({
        activityId: this.activityId,
        name: this.activityForm.controls.name.value!,
        teacherFullName: this.activityForm.controls.teacherFullName.value!,
        room: this.activityForm.controls.room.value!,
        weekDay: this.activityForm.controls.weekDay.value!,
        startingHour: this.activityForm.controls.startingHour.value!,
        duration: this.activityForm.controls.duration.value!,
        buildingId: building?.id,
      }).subscribe({
        next: () => {
          this.syncService.refreshActivities$.next();
          this.snackBarService.openMessage("ActivityUpdated");
          this.dialogRef.close();
        },
        error: (err) => {
          this.snackBarService.openError(err);
          this.activityForm.setErrors({'incorrect': true})
        }
      })
    } else {
      this.activityRepository.create$({ 
        groupId: this.group.id!,
        name: this.activityForm.controls.name.value!,
        teacherFullName: this.activityForm.controls.teacherFullName.value!,
        room: this.activityForm.controls.room.value!,
        sessionNumbers: this.sessionsSelected,
        weekDay: this.activityForm.controls.weekDay.value!,
        springSemester: this.group.springSemester,
        startingHour: this.activityForm.controls.startingHour.value!,
        duration: this.activityForm.controls.duration.value!,
        buildingId: building?.id,
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
  }

  onSessionClicked(sessionNumber: number, selected: boolean) {
    this.sessionsSelected = this.sessionsSelected.filter(x => x !== sessionNumber);
    if (selected) {
      this.sessionsSelected.push(sessionNumber);
    }
    this.activityForm.get('sessions')?.setValue(this.sessionsSelected);
  }

  handleCreateBuilding() {
    // this.dialog.open(CreateCourseDialogComponent, {
    //   maxWidth: '100vw',
    //   autoFocus: false
    // }).afterClosed().subscribe((result:SelectValue | null) => {
    //   if(!result)
    //     return;
    //   this.updateStudyCourses(result);
    // });
  }

  getGroupName(group: GroupResponse): string { return GroupHelper.groupInfoToString(group)}

  parseSessionNumber(sessionNumber: number): string {
    return sessionNumber.toString().padStart(2, '0') 
  }
  get sessionsHalf1(): SelectValue[]  {
    return this.allSessions.filter((x, index) => index < this.allSessions.length / 2);
  }
  get sessionsHalf2(): SelectValue[]  {
    return this.allSessions.filter((x, index) => index >= this.allSessions.length / 2);
  }

  getEndHour(): string {
    if (this.activityId) {
      return this.getEndHourWithParams(
        this.activityForm.controls.duration.value!,
        this.activityForm.controls.startingHour.value!
      )
    }

    if (this.activityForm.controls.startingHour.dirty){
      return this.getEndHourWithParams(
        this.activityForm.controls.duration.value!,
        this.activityForm.controls.startingHour.value!
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
  displayFn(value: SelectValue): string {
    return value && value.displayText ? value.displayText : '';
  }

  get canModify(): boolean {
    return this.activityId != undefined && this.isAdmin;
  }

  private updateBuildings(building: SelectValue | null) {
    this.buildingService.get$().pipe(
      map(buildings => buildings.map(x => ({
        id: x.buildingId,
        displayText: x.name
      }) as SelectValue))
    ).subscribe({
      next: (value) => {
        this.allBuildings = value
        this.activityForm.controls.building.setValue(building);
      }
    });
  }

  private getAllHours(): number[] {
    const dayStart = 8;
    const dayEnd = 20;

    let currentHour = dayStart;
    const result: number[] = []
    for (dayStart; currentHour <= dayEnd; currentHour++) {
      result.push(currentHour)
    }

    return result;
  }
}



