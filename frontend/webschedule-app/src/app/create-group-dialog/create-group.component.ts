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
import { SessionEditorComponent } from "../session-editor/session-editor.component";
import { SessionDto } from '../dtos/sessionDto';
import { SessionRequest } from '../../services/group/dtos/sessionRequest';

@Component({
  selector: 'app-create-group',
  imports: [
    MatFormFieldModule, MatLabel, MatInputModule,
    MatButtonModule, ReactiveFormsModule, CommonModule, MatIconModule, MatSelectModule, MatOptionModule,
    TranslatePipe, MatAutocompleteModule, MatTooltipModule, MatDividerModule,
    SessionEditorComponent
],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss'
})
export class CreateGroupComponent {
  studyLevels = Constants.StudyLevels;
  filteredOptionsCourse$: Observable<SelectValue[]>;
  allCourses: SelectValue[] = [];
  nextSubgroup$: Observable<string>;

  fallSessions: SessionDto[] = []
  springSessions: SessionDto[] = []
  
  groupForm = new FormGroup({
    year: new FormControl(this.getCurrentYear(), { validators: [Validators.min(this.getLowestYear()), Validators.max(this.getHighestYear())] }),
    subgroup: new FormControl({value: "01", disabled: true}),
    level: new FormControl(),
    course: new FormControl<SelectValue | null>(null)
  });

  constructor(
    private groupService: GroupRepositoryService,
    private readonly dialog: MatDialog,
    private studyCourseService: StudyCourseRepository,
    private snackBarService: SnackBarService,
    private router: Router,
    private syncService: SyncService,
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

  handleFallSessionUpdate(sessions: SessionDto) {
    // this.fallSessions = [...sessions];
  }
  handleSpringSessionUpdate(sessions: SessionDto) {
    // this.springSessions = [...sessions];
  }
  submit() {
    const springSessions: SessionRequest[] = this.springSessions
      .filter(x => x.number != null)
      .map(x => ({...x, springSemester: true }) as SessionRequest)
    const fallSessions: SessionRequest[] = this.fallSessions
      .filter(x => x.number != null)
      .map(x => ({...x, springSemester: false }) as SessionRequest)
      
    const sessions = springSessions.concat(fallSessions);
    this.groupService.create$({ 
      year: this.groupForm.controls.year.value!, 
      subgroup: this.groupForm.controls.subgroup.value!,
      level: this.groupForm.controls.level.value!,
      courseId: this.groupForm.controls.course.value!.id,
      sessions: sessions
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
}
