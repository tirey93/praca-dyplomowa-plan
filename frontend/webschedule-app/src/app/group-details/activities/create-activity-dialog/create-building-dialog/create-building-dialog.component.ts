import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogTitle, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BuildingService } from '../../../../../services/building/building.service';
import { SnackBarService } from '../../../../../services/snackBarService';
import { SelectValue } from '../../../../dtos/selectValue';

@Component({
  selector: 'app-create-building-dialog',
  imports: [
    MatDialogContent, MatDialogTitle, MatDialogActions, MatTooltipModule, MatButtonModule,
    ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatLabel, CommonModule
  ],
  templateUrl: './create-building-dialog.component.html',
  styleUrl: './create-building-dialog.component.scss'
})
export class CreateBuildingDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<CreateBuildingDialogComponent>,
    private buildingService: BuildingService,
    private snackBarService: SnackBarService
  ) {
    
  }

  buildingForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    link: new FormControl('', [Validators.required, Validators.pattern('(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})')])
  });

  onNoClick(): void {
    this.dialogRef.close(null);
  }
  submit() {
    this.buildingService.create$({ 
      name: this.buildingForm.controls.name.value!, 
      link: this.buildingForm.controls.link.value!, 
    }).subscribe({
      next: (building) => {
        this.dialogRef.close({displayText: building.name, id: building.buildingId} as SelectValue);
      },
      error: (err) => {
        this.snackBarService.openError(err);
        this.buildingForm.setErrors({'incorrect': true})
      }
    })
  }
}
