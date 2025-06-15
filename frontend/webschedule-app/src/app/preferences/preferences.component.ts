import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-preferences',
  imports: [
    MatTabsModule, MatDialogTitle, MatFormFieldModule, ReactiveFormsModule, MatLabel, MatDialogContent, MatInputModule,
    MatDialogActions, MatTooltipModule, MatButtonModule
  ],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss'
})
export class PreferencesComponent {
submit() {
throw new Error('Method not implemented.');
}
onNoClick() {
throw new Error('Method not implemented.');
}
  prefForm = new FormGroup({
    login: new FormControl(),
    displayName: new FormControl(),
  });
}
