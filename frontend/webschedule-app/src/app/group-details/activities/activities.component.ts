import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateActivityDialogComponent } from './create-activity-dialog/create-activity-dialog.component';
import { UserGroupResponse } from '../../../services/userInGroup/dtos/userGroupResponse';

@Component({
  selector: 'app-activities',
  imports: [
    MatButtonModule, MatTooltipModule, MatIconModule
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent {
  @Input() userGroup?: UserGroupResponse

  constructor(
    private readonly dialog: MatDialog
  ) {    
  }

  addActivity() {
    this.dialog.open(CreateActivityDialogComponent, {
      maxWidth: '50vw',
      autoFocus: false,
      data: {
        userGroup: this.userGroup
      },
    })
  }
}
