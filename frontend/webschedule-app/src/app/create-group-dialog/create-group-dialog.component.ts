import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Constants } from '../../helpers/constants';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BehaviorSubject, combineLatest, debounceTime, filter, map, Observable, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import { SelectValue } from '../dtos/selectValue';
import { StudyCourseRepository } from '../../services/study-course/studyCourseRepository.service';
import { GroupRepositoryService } from '../../services/group/groupRepository.service';
import { GroupHelper } from '../../helpers/groupHelper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateCourseDialogComponent } from '../create-course-dialog/create-course-dialog.component';

@Component({
  selector: 'app-create-gro-up-dialog',
  imports: [ 
    MatDialogContent, MatDialogTitle, MatFormFieldModule, MatLabel, MatInputModule, MatDialogActions, 
    MatButtonModule, ReactiveFormsModule, CommonModule, MatIconModule, MatSelectModule, MatOptionModule,
    TranslatePipe, MatAutocompleteModule, MatTooltipModule
  ],
  templateUrl: './create-group-dialog.component.html',
  styleUrl: './create-group-dialog.component.scss'
})
export class CreateGroupDialogComponent {
  studyModes = Constants.StudyModes;
  studyLevels = Constants.StudyLevels;
  filteredOptionsCourse$: Observable<SelectValue[]>;
  allCourses: SelectValue[] = [];
  nextSubgroup$: Observable<string>;

  groupForm = new FormGroup({
    year: new FormControl(this.getCurrentYear(), { validators: [Validators.min(this.getLowestYear()), Validators.max(this.getHighestYear())] }),
    subgroup: new FormControl({value: "01", disabled: true}),
    mode: new FormControl(),
    level: new FormControl(),
    course: new FormControl<SelectValue | null>(null)
  });
  
  constructor(
    private dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    private groupService: GroupRepositoryService,
    private readonly dialog: MatDialog,
    private studyCourseService: StudyCourseRepository,
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
      this.groupForm.controls.mode.valueChanges.pipe(startWith(this.groupForm.controls.mode.value)),
      this.groupForm.controls.level.valueChanges.pipe(startWith(this.groupForm.controls.level.value)),
      this.groupForm.controls.course.valueChanges.pipe(
        startWith(this.groupForm.controls.course.value),
        map(value => (typeof value === 'object' && value !== null && 'id' in value ? (value as SelectValue).id : null))
      ),
    ]).pipe(
      debounceTime(50),
      filter(([year, mode, level, courseId]) => {
        const isFormValid = this.groupForm.valid;
        const areApiParamsReady =
          year !== null && year !== undefined &&
          mode !== null && mode !== undefined &&
          level !== null && level !== undefined &&
          courseId !== null && courseId !== undefined &&
          typeof courseId === 'number';
        return isFormValid && areApiParamsReady;
      }),
      switchMap(([year, mode, level, courseId]) => {
        return this.groupService.getNextSubgroup$(
          year!,
          mode!,
          level!,
          courseId!
        ).pipe(map(x => GroupHelper.parseSubgroup(x)));
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
  onNoClick(): void {
    console.log(this.groupForm.controls.course.value);
    this.dialogRef.close(false);
  }
  displayFn(value: SelectValue): string {
    return value && value.displayText ? value.displayText : '';
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

  submit() {
    console.log('submit');
  }
}
