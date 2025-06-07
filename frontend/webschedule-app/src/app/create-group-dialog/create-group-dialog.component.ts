import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Constants } from '../../helpers/constants';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, shareReplay, startWith, switchMap } from 'rxjs';
import { SelectValue } from '../dtos/selectValue';
import { StudyCourseRepository } from '../../services/study-course/studyCourseRepository.service';

@Component({
  selector: 'app-create-gro-up-dialog',
  imports: [ 
    MatDialogContent, MatDialogTitle, MatFormFieldModule, MatLabel, MatInputModule, MatDialogActions, 
    MatButtonModule, ReactiveFormsModule, CommonModule, MatIconModule, MatSelectModule, MatOptionModule,
    TranslatePipe, MatAutocompleteModule
  ],
  templateUrl: './create-group-dialog.component.html',
  styleUrl: './create-group-dialog.component.scss'
})
export class CreateGroupDialogComponent {
  studyModes = Constants.StudyModes;
  studyLevels = Constants.StudyLevels;
  filteredOptionsCourse$: Observable<SelectValue[]>;
  allCourses$: Observable<SelectValue[]>;

  groupForm = new FormGroup({
    year: new FormControl(this.getCurrentYear(), { validators: [Validators.min(this.getLowestYear()), Validators.max(this.getHighestYear())] }),
    subgroup: new FormControl({value: "01", disabled: true}),
    mode: new FormControl(),
    level: new FormControl(),
    course: new FormControl<SelectValue | null>(null)
  });


  
  constructor(
    private dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    studyCourseService: StudyCourseRepository
  ) {
    this.allCourses$ = studyCourseService.get$().pipe(
      map(groupResponses => groupResponses.map(x => ({ 
        id: x.id, 
        displayText: x.name
      }) as SelectValue)),
      shareReplay()
    );
    this.filteredOptionsCourse$ = this.groupForm.controls.course.valueChanges.pipe(
      startWith(null),
      switchMap((value: string | SelectValue | null) => {
        let filterValue = ''
        if (value) {
          filterValue = (typeof value === 'string' ? value : value?.displayText || '').toLowerCase();
        }
        return value 
          ? this.allCourses$
              .pipe(map(x => x
                .filter(option => option.displayText.toLowerCase().includes(filterValue))))
          : this.allCourses$
      })
    )
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
