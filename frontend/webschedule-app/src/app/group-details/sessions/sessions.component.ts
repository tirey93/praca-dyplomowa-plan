import { Component, Input, OnInit } from '@angular/core';
import { SessionEditorComponent } from "../../session-editor/session-editor.component";
import { UserGroupResponse } from '../../../services/userInGroup/dtos/userGroupResponse';
import { MatTabsModule } from '@angular/material/tabs';
import { SessionDto } from '../../dtos/sessionDto';
import { SessionRequest } from '../../../services/group/dtos/sessionRequest';
import { SnackBarService } from '../../../services/snackBarService';
import { SessionService } from '../../../services/session/session.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ChangeSemesterDialogComponent } from './change-semester-dialog/change-semester-dialog.component';

@Component({
  selector: 'app-sessions',
  imports: [
    SessionEditorComponent, MatTabsModule, MatIconModule, MatButtonModule, MatMenuModule, MatTooltipModule
  ],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss'
})
export class SessionsComponent implements OnInit{
  @Input() userGroup?: UserGroupResponse
  springSemester = false;

  constructor(
    private sessionRepository: SessionService,
    private snackBarService: SnackBarService,
    private readonly dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.springSemester = this.userGroup?.group.springSemester!;
  }

  onChangeSemester() {
    this.dialog.open(ChangeSemesterDialogComponent, {
      data: {
        userGroup: this.userGroup,
        springSemester: this.springSemester
      },
    }).afterClosed().subscribe((result:boolean) => {
      if (result) {
        this.springSemester = !this.springSemester;
      }
    });
  }
  handleFallSessionUpdate(session: SessionDto) {
    this.sessionRepository.updateSession$({
      groupId: this.userGroup?.group.id!,
      session: {
        number: session.number!,
        weekNumber: session.weekNumber,
        springSemester: false
      }
    }).subscribe({
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  handleSpringSessionUpdate(session: SessionDto) {
    this.sessionRepository.updateSession$({
      groupId: this.userGroup?.group.id!,
      session: {
        number: session.number!,
        weekNumber: session.weekNumber,
        springSemester: true
      }
    }).subscribe({
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }
}
