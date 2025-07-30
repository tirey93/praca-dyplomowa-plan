import { Component, Input } from '@angular/core';
import { SessionEditorComponent } from "../../session-editor/session-editor.component";
import { UserGroupResponse } from '../../../services/userInGroup/dtos/userGroupResponse';
import { MatTabsModule } from '@angular/material/tabs';
import { SessionDto } from '../../dtos/sessionDto';
import { SessionRequest } from '../../../services/group/dtos/sessionRequest';
import { SnackBarService } from '../../../services/snackBarService';
import { SessionInGroupService } from '../../../services/sessionInGroup/sessionInGroup.service';

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
    private sessionInGroupRepository: SessionInGroupService,
    private snackBarService: SnackBarService,
  ) {
  }

  handleFallSessionUpdate(session: SessionDto) {
    this.sessionInGroupRepository.updateSession$({
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
    this.sessionInGroupRepository.updateSession$({
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
