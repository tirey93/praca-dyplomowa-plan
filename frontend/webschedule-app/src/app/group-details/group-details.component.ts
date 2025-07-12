import { Component, OnInit } from '@angular/core';
import { GroupRepositoryService } from '../../services/group/groupRepository.service';
import { UserGroupResponse } from '../../services/group/dtos/userGroupResponse';
import { filter, Observable, switchMap } from 'rxjs';
import { GroupHelper } from '../../helpers/groupHelper';
import { AsyncPipe } from '@angular/common';
import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-group-details',
  imports: [
    AsyncPipe
  ],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.scss'
})
export class GroupDetailsComponent{
  group$: Observable<UserGroupResponse>;

  constructor(
    private groupRepository: GroupRepositoryService,
    sidenavService: SidenavService
  ) {
    this.group$ = sidenavService.groupId$.pipe(
      filter(groupId => groupId != null),
      switchMap((groupId) => this.groupRepository.getById$(groupId))
    )
  }

  getGroupName(group: UserGroupResponse): string { return GroupHelper.groupInfoToString(group)}
}
