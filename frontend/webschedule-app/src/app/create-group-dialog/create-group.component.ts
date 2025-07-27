import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Constants } from '../../helpers/constants';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { combineLatest, debounceTime, filter, map, Observable, startWith, switchMap } from 'rxjs';
import { SelectValue } from '../dtos/selectValue';
import { StudyCourseRepository } from '../../services/study-course/studyCourseRepository.service';
import { GroupRepositoryService } from '../../services/group/groupRepository.service';
import { GroupHelper } from '../../helpers/groupHelper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackBarService } from '../../services/snackBarService';
import { CreateCourseDialogComponent } from './create-course-dialog/create-course-dialog.component';
import { Router } from '@angular/router';
import { SyncService } from '../../services/sync.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SessionInGroupResponse } from '../../services/sessionInGroup/dtos/sessionInGroupResponse';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SessionInGroupService } from '../../services/sessionInGroup/sessionInGroup.service';

export interface SessionDto {
  period: string;
  number?: number;
}

@Component({
  selector: 'app-create-group',
  imports: [ 
    MatFormFieldModule, MatLabel, MatInputModule,
    MatButtonModule, ReactiveFormsModule, CommonModule, MatIconModule, MatSelectModule, MatOptionModule,
    TranslatePipe, MatAutocompleteModule, MatTooltipModule, MatDividerModule, MatTableModule, MatProgressSpinnerModule
  ],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss'
})
export class CreateGroupComponent {
  studyLevels = Constants.StudyLevels;
  filteredOptionsCourse$: Observable<SelectValue[]>;
  allCourses: SelectValue[] = [];
  nextSubgroup$: Observable<string>;

  groupForm = new FormGroup({
    year: new FormControl(this.getCurrentYear(), { validators: [Validators.min(this.getLowestYear()), Validators.max(this.getHighestYear())] }),
    subgroup: new FormControl({value: "01", disabled: true}),
    level: new FormControl(),
    course: new FormControl<SelectValue | null>(null)
  });
  
  isLoading = true;
  noData = false;
  displayedColumns: string[] = ['period', 'number'];
  sessions?: MatTableDataSource<SessionDto>;

  constructor(
    private groupService: GroupRepositoryService,
    private readonly dialog: MatDialog,
    private studyCourseService: StudyCourseRepository,
    private snackBarService: SnackBarService,
    private router: Router,
    private syncService: SyncService,
    private sessionInGroupService: SessionInGroupService
  ) {
    this.updateStudyCourses(null);
    this.filteredOptionsCourse$ = this.groupForm.controls.course.valueChanges.pipe(
      map((value) => {
        if (!this.allCourses) {
          return [];
        }
        const filterValue = (typeof value === 'string' ? value : value?.displayText || '').toLowerCase();
        
        if (!filterValue.trim()) {
          return this.allCourses.slice();
        }
        return this.allCourses.filter(course => course.displayText.toLowerCase().includes(filterValue));
      }),
    );

    this.nextSubgroup$ = combineLatest([
      this.groupForm.controls.year.valueChanges.pipe(startWith(this.groupForm.controls.year.value)),
      this.groupForm.controls.level.valueChanges.pipe(startWith(this.groupForm.controls.level.value)),
      this.groupForm.controls.course.valueChanges.pipe(
        startWith(this.groupForm.controls.course.value),
        map(value => (typeof value === 'object' && value !== null && 'id' in value ? (value as SelectValue).id : null))
      ),
    ]).pipe(
      debounceTime(50),
      filter(([year, level, courseId]) => {
        const isFormValid = this.groupForm.valid;
        const areApiParamsReady =
          year !== null && year !== undefined &&
          level !== null && level !== undefined &&
          courseId !== null && courseId !== undefined &&
          typeof courseId === 'number';
        return isFormValid && areApiParamsReady;
      }),
      switchMap(([year, level, courseId]) => {
        return this.groupService.getNextSubgroup$(
          year!,
          level!,
          courseId!
        ).pipe(map(x => {
          const subgroup = GroupHelper.parseSubgroup(x)
          this.groupForm.controls.subgroup.setValue(subgroup);
          return subgroup;
        }));
      }),
    );

    sessionInGroupService.getDefaults$().subscribe({
      next: (sessionsInGroupResponse) => {
        this.isLoading = false;
        if (sessionsInGroupResponse.length === 0) {
          this.noData = true;
          return;
        }
        this.sessions = new MatTableDataSource<SessionDto>();
        this.sessions.data = this.getDataForSessions(sessionsInGroupResponse.filter(x => !x.springSemester));
      }
    })
  }

  private updateStudyCourses(studyCourse: SelectValue | null) {
    this.studyCourseService.get$().pipe(
      map(groupResponses => groupResponses.map(x => ({
        id: x.id,
        displayText: x.name
      }) as SelectValue))
    ).subscribe({
      next: (value) => {
        this.allCourses = value
        this.groupForm.controls.course.setValue(studyCourse);
      }
    });
  }

  handleCreateCourse() {
    this.dialog.open(CreateCourseDialogComponent, {
      maxWidth: '100vw',
      autoFocus: false
    }).afterClosed().subscribe((result:SelectValue | null) => {
      if(!result)
        return;
      this.updateStudyCourses(result);
    });
  }

  displayFn(value: SelectValue): string {
    return value && value.displayText ? value.displayText : '';
  }

  handleAddToGroup(_t119: any) {
    throw new Error('Method not implemented.');
  }

  submit() {
    this.groupService.create$({ 
      year: this.groupForm.controls.year.value!, 
      subgroup: this.groupForm.controls.subgroup.value!,
      level: this.groupForm.controls.level.value!,
      courseId: this.groupForm.controls.course.value!.id,
    }).subscribe({
      next: () => {
        this.router.navigateByUrl("");
        this.syncService.refreshGroups$.next();
      },
      error: (err) => {
        this.snackBarService.openError(err);
        this.groupForm.setErrors({'incorrect': true})
      }
    })
  }
  
  private getCurrentYear(): number {
    return (new Date()).getFullYear()
  }

  private getLowestYear(): number {
    return this.getCurrentYear() - 20;
  }

  private getHighestYear(): number {
    return this.getCurrentYear() + 5;
  }

  private getSaturdayOfWeek(weekNumber: number, year: number = new Date().getFullYear()): Date {
      const januaryFirst = new Date(year, 0, 1);
      const dayOfWeek = januaryFirst.getDay();
      const firstMonday = new Date(januaryFirst);
      if (dayOfWeek <= 4) {
          firstMonday.setDate(januaryFirst.getDate() - dayOfWeek + 1);
      } else {
          firstMonday.setDate(januaryFirst.getDate() + 8 - dayOfWeek);
      }
      const saturday = new Date(firstMonday);
      saturday.setDate(firstMonday.getDate() + (weekNumber - 1) * 7 + 5);
      if (saturday < new Date()) {
        return this.getSaturdayOfWeek(weekNumber, year + 1);
      }
      return saturday;
  }

  private getPeriod(date: Date): string {
    const saturday = date.getDate().toString().padStart(2, '0');
    const sundayFull = new Date(date.getTime() + (1000 * 60 * 60 * 24));
    const sunday = sundayFull.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${saturday}-${sunday}.${month}.${year}`
  }

  private getDataForSessions(sessionsInGroupResponse: SessionInGroupResponse[]): SessionDto[] {
    const result: SessionDto[] = [];
    let currentSessionIndex = 0;
    let currentWeek = sessionsInGroupResponse[currentSessionIndex].weekNumber;
    const lastWeek = sessionsInGroupResponse[sessionsInGroupResponse.length - 1].weekNumber;

    while(currentWeek !== lastWeek) {
      if (currentWeek === sessionsInGroupResponse[currentSessionIndex].weekNumber) {
        result.push({
          period: this.getPeriod(this.getSaturdayOfWeek(currentWeek)),
          number: sessionsInGroupResponse[currentSessionIndex].number
        })
        currentSessionIndex++;
      } else {
        result.push({
          period: this.getPeriod(this.getSaturdayOfWeek(currentWeek))
        })
      }

      if (currentWeek === 52){
        currentWeek = 1
      } else {
        currentWeek++;
      }
    }

    result.push({
      period: this.getPeriod(this.getSaturdayOfWeek(currentWeek)),
      number: sessionsInGroupResponse[currentSessionIndex].number
    })
    result.push({
      period: this.getPeriod(this.getSaturdayOfWeek(currentWeek + 1))
    })
    result.push({
      period: this.getPeriod(this.getSaturdayOfWeek(currentWeek + 2))
    })
    return result;
  }
}
