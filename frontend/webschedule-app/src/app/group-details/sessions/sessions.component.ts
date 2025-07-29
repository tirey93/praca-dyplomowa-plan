import { Component, Input } from '@angular/core';
import { SessionEditorComponent } from "../../session-editor/session-editor.component";
import { UserGroupResponse } from '../../../services/userInGroup/dtos/userGroupResponse';
import { MatTabsModule } from '@angular/material/tabs';
import { SessionDto } from '../../dtos/sessionDto';
import { SessionRequest } from '../../../services/group/dtos/sessionRequest';
import { GroupRepositoryService } from '../../../services/group/groupRepository.service';
import { SnackBarService } from '../../../services/snackBarService';

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
    private groupRepository: GroupRepositoryService,
    private snackBarService: SnackBarService,
  ) {
  }

  handleFallSessionUpdate(sessions: SessionDto[]) {
    const fallSessions: SessionRequest[] = sessions
      .filter(x => x.number != null)
      .map(x => ({...x, springSemester: false }) as SessionRequest)

    this.groupRepository.updateSessions$({
      groupId: this.userGroup?.group.id!,
      springSemester: false,
      sessions: fallSessions
    }).subscribe({
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  handleSpringSessionUpdate(sessions: SessionDto[]) {
    const springSessions: SessionRequest[] = sessions
      .filter(x => x.number != null)
      .map(x => ({...x, springSemester: true }) as SessionRequest)

    this.groupRepository.updateSessions$({
      groupId: this.userGroup?.group.id!,
      springSemester: true,
      sessions: springSessions
    }).subscribe({
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }
}
