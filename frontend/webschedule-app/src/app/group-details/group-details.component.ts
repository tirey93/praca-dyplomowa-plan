import { Component, OnDestroy } from '@angular/core';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { GroupMembersComponent } from "./group-members/group-members.component";
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChatComponent } from "./chat/chat.component";
import { LeaveGroupDialogComponent } from './leave-group-dialog/leave-group-dialog.component';
import { RemoveGroupDialogComponent } from './remove-group-dialog/remove-group-dialog.component';
import { environment } from '../../enviroments/enviroments';
import { GroupHelper } from '../../helpers/groupHelper';
import { SnackBarService } from '../../services/snackBarService';
import { SyncService } from '../../services/sync.service';
import { UserGroupResponse } from '../../services/userInGroup/dtos/userGroupResponse';
import { UserInGroupService } from '../../services/userInGroup/userInGroup.service';
import { SessionsComponent } from "./sessions/sessions.component";
import { ActivitiesComponent } from './activities/activities.component';


@Component({
  selector: 'app-group-details',
  imports: [
    MatCardModule, MatChipsModule, TranslatePipe, MatTabsModule, MatIconModule, MatMenuModule, MatButtonModule,
    ClipboardModule, GroupMembersComponent, MatTooltipModule,
    ChatComponent, SessionsComponent, ActivitiesComponent
],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.scss'
})
export class GroupDetailsComponent implements OnDestroy{
  userGroup?: UserGroupResponse;

  private destroy$ = new Subject<void>();

  constructor(
    private syncService: SyncService,
    private readonly dialog: MatDialog,
    public snackBarService: SnackBarService,
  ) {
    syncService.currentUserGroup$.pipe(
      takeUntil(this.destroy$),
      filter(userGroup => userGroup != null),
    ).subscribe({
      next: (userGroupResponse) => {
        this.userGroup = userGroupResponse;
      },
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeSidenav() {
    this.syncService.unselectGroup();
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
        this.syncService.refreshGroups$.next();
      }
    })
  }

  onTabIndexChange(index: number) {
    if (index === 2) {
      this.syncService.selectGroup(this.userGroup?.group.id!)
    }
  }

  getGroupName(userGroup: UserGroupResponse): string { return GroupHelper.groupInfoToString(userGroup.group)}

  getLinkToGroup(): string {
    return `${environment.host}:${environment.webPort}/group/${this.userGroup?.group.id}`;
  }
}
