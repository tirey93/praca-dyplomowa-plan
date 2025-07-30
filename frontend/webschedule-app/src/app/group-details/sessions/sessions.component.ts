import { Component, Input } from '@angular/core';
import { SessionEditorComponent } from "../../session-editor/session-editor.component";
import { UserGroupResponse } from '../../../services/userInGroup/dtos/userGroupResponse';
import { MatTabsModule } from '@angular/material/tabs';
import { SessionDto } from '../../dtos/sessionDto';
import { SessionRequest } from '../../../services/group/dtos/sessionRequest';
import { SnackBarService } from '../../../services/snackBarService';
import { SessionService } from '../../../services/session/session.service';

@Component({
  selector: 'app-sessions',
  imports: [
    SessionEditorComponent, MatTabsModule
  ],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss'
})
export class SessionsComponent {
  @Input() userGroup?: UserGroupResponse


  constructor(
    private sessionRepository: SessionService,
    private snackBarService: SnackBarService,
  ) {
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
