import { Component } from '@angular/core';
import { MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { LoginUpdateComponent } from "./login-update/login-update.component";
import { DisplayNameUpdateComponent } from "./display-name-update/display-name-update.component";
import { PasswordUpdateComponent } from "./password-update/password-update.component";

@Component({
  selector: 'app-preferences',
  imports: [
    MatTabsModule, MatDialogTitle, MatDialogContent,
    LoginUpdateComponent,
    DisplayNameUpdateComponent,
    PasswordUpdateComponent
  ],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss'
})
export class PreferencesComponent {
  
}
