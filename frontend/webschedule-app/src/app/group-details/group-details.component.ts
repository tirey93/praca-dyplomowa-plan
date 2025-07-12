import { Component, OnDestroy, OnInit } from '@angular/core';
import { GroupRepositoryService } from '../../services/group/groupRepository.service';
import { UserGroupResponse } from '../../services/group/dtos/userGroupResponse';
import { filter, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { GroupHelper } from '../../helpers/groupHelper';
import { AsyncPipe } from '@angular/common';
import { SidenavService } from '../../services/sidenav.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { LeaveGroupDialogComponent } from '../main/week-schedule/leave-group-dialog/leave-group-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-group-details',
  imports: [
    MatCardModule, MatChipsModule, TranslatePipe, MatTabsModule, MatIconModule, MatMenuModule, MatButtonModule
],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.scss'
})
export class GroupDetailsComponent implements OnDestroy{
  group?: UserGroupResponse;

  private destroy$ = new Subject<void>();

  constructor(
    private groupRepository: GroupRepositoryService,
    private sidenavService: SidenavService,
    private readonly dialog: MatDialog,
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

  closeSidenav() {
    this.sidenavService.unselectGroup();
  }

  leaveGroup() {
    this.dialog.open(LeaveGroupDialogComponent, {
      data: {
        group: this.group
      },
    })
  }

  getGroupName(group: UserGroupResponse): string { return GroupHelper.groupInfoToString(group)}
}
