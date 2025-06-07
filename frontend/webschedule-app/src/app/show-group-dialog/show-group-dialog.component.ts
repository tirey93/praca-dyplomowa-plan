import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { UserGroupResponse } from '../../services/group/dtos/userGroupResponse';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { GroupRepositoryService } from '../../services/group/groupRepository.service';
import { GroupHelper } from '../../helpers/groupHelper';

@Component({
  selector: 'app-show-group-dialog',
  imports: [MatDialogContent, MatDialogTitle, AsyncPipe],
  templateUrl: './show-group-dialog.component.html',
  styleUrl: './show-group-dialog.component.scss'
})
export class ShowGroupDialogComponent {
  group$: Observable<UserGroupResponse>
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public groupId: number,
    groupRepository: GroupRepositoryService,
  ) {
    this.group$ = groupRepository.getById$(this.groupId);
  }

  getGroupName(group: UserGroupResponse): string { return GroupHelper.groupInfoToString(group)}
}
