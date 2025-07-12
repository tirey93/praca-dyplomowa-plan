import { Component, OnDestroy, OnInit } from '@angular/core';
import { GroupRepositoryService } from '../../services/group/groupRepository.service';
import { UserGroupResponse } from '../../services/group/dtos/userGroupResponse';
import { filter, Observable, Subject, switchMap, takeUntil } from 'rxjs';
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
export class GroupDetailsComponent implements OnDestroy{
  group?: UserGroupResponse;

  private destroy$ = new Subject<void>();

  constructor(
    private groupRepository: GroupRepositoryService,
    sidenavService: SidenavService
  ) {
    sidenavService.groupId$.pipe(
      takeUntil(this.destroy$),
      filter(groupId => groupId != null),
      switchMap((groupId) => this.groupRepository.getById$(groupId))
    ).subscribe({
      next: (userGroupResponse) => {
        this.group = userGroupResponse;
      }
    })
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getGroupName(group: UserGroupResponse): string { return GroupHelper.groupInfoToString(group)}
}
