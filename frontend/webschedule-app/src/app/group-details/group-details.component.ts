import { Component, OnDestroy } from '@angular/core';
import { UserGroupResponse } from '../../services/userInGroup/dtos/userGroupResponse';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { GroupHelper } from '../../helpers/groupHelper';
import { GroupSyncService } from '../../services/groupSync.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { LeaveGroupDialogComponent } from '../main/week-schedule/leave-group-dialog/leave-group-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { RemoveGroupDialogComponent } from '../main/week-schedule/remove-group-dialog/remove-group-dialog.component';
import { UserInGroupService } from '../../services/userInGroup/user-in-group.service';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { SnackBarService } from '../../services/snackBarService';
import { environment } from '../../enviroments/enviroments';
import { GroupMembersComponent } from "./group-members/group-members.component";


@Component({
  selector: 'app-group-details',
  imports: [
    MatCardModule, MatChipsModule, TranslatePipe, MatTabsModule, MatIconModule, MatMenuModule, MatButtonModule,
    ClipboardModule,
    GroupMembersComponent
],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.scss'
})
export class GroupDetailsComponent implements OnDestroy{
  userGroup?: UserGroupResponse;

  private destroy$ = new Subject<void>();

  constructor(
    private userInGroupRepository: UserInGroupService,
    private groupSyncService: GroupSyncService,
    private readonly dialog: MatDialog,
    public snackBarService: SnackBarService,
  ) {
    groupSyncService.groupId$.pipe(
      takeUntil(this.destroy$),
      filter(groupId => groupId != null),
      switchMap((groupId) => this.userInGroupRepository.getLoggedInByGroup$(groupId))
    ).subscribe({
      next: (userGroupResponse) => {
        this.userGroup = userGroupResponse;
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeSidenav() {
    this.groupSyncService.unselectGroup();
  }

  leaveGroup() {
    this.dialog.open(LeaveGroupDialogComponent, {
      data: {
        userGroup: this.userGroup
      },
    })
  }

  removeGroup() {
    this.dialog.open(RemoveGroupDialogComponent, {
      data: {
        userGroup: this.userGroup
      },
    }).afterClosed().subscribe((result:boolean) => {
      if (result) {
        this.closeSidenav();
        this.groupSyncService.refreshGroups$.next();
      }
    })
  }

  getGroupName(userGroup: UserGroupResponse): string { return GroupHelper.groupInfoToString(userGroup.group)}

  getLinkToGroup(): string {
    return `${environment.host}:${environment.webPort}/group/${this.userGroup?.group.id}`;
  }
}
