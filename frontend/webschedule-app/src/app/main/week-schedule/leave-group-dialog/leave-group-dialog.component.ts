import { Component } from '@angular/core';
import { SidenavService } from '../../../../services/sidenav.service';
import { MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UserGroupResponse } from '../../../../services/group/dtos/userGroupResponse';
import { filter, map, Observable, switchMap } from 'rxjs';
import { GroupRepositoryService } from '../../../../services/group/groupRepository.service';
import { GroupHelper } from '../../../../helpers/groupHelper';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-leave-group-dialog',
  imports: [
    MatDialogModule, MatButtonModule, AsyncPipe
  ],
  templateUrl: './leave-group-dialog.component.html',
  styleUrl: './leave-group-dialog.component.scss'
})
export class LeaveGroupDialogComponent {
  groupName$: Observable<string>;

  constructor(
    private sidenavService: SidenavService,
    private groupRepository: GroupRepositoryService,
    private dialogRef: MatDialogRef<LeaveGroupDialogComponent>,
  ) {
    this.groupName$ = sidenavService.groupId$.pipe(
        filter(groupId => groupId != null),
        switchMap((groupId) => this.groupRepository.getById$(groupId)),
        map((response) => GroupHelper.groupInfoToString(response))
      )
  }

  onNoClick() {
    this.dialogRef.close();
  }

  leave() {
    throw new Error('Method not implemented.');
  }
}
