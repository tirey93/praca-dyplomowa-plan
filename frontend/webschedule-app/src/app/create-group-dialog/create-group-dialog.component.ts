import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-group-dialog',
  imports: [ 
    MatDialogContent, MatDialogTitle, MatFormFieldModule, MatLabel, MatInputModule, MatDialogActions, 
    MatButtonModule, ReactiveFormsModule, CommonModule, MatIconModule
    
  ],
  templateUrl: './create-group-dialog.component.html',
  styleUrl: './create-group-dialog.component.scss'
})
export class CreateGroupDialogComponent {
  groupForm = new FormGroup({
    year: new FormControl(this.getCurrentYear(), { validators: [Validators.min(this.getLowestYear()), Validators.max(this.getHighestYear())] }),
    subgroup: new FormControl({value: "01", disabled: true}),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateGroupDialogComponent>,
  ) {
  }

  onNoClick(): void {
    console.log(this.groupForm.controls.subgroup.value);
    this.dialogRef.close(false);
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
