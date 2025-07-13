import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { GroupRepositoryService } from '../../../services/group/groupRepository.service';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GroupSyncService } from '../../../services/groupSync.service';
import { filter, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GroupDetailsComponent } from "../../group-details/group-details.component";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { LeaveGroupDialogComponent } from './leave-group-dialog/leave-group-dialog.component';
import { UserInGroupService } from '../../../services/userInGroup/userInGroup.service';

@Component({
  selector: 'app-week-schedule',
  imports: [
    MatButtonModule, MatSidenavModule, AsyncPipe, GroupDetailsComponent,
    MatTooltipModule
  ],
  templateUrl: './week-schedule.component.html',
  styleUrl: './week-schedule.component.scss'
})
export class WeekScheduleComponent implements OnInit, OnDestroy{
  @Input() userGroups: number[] = [];
  @Input() groupId?: number;
  sidenavOpened$: Observable<boolean>;
  sidenavGroupId$: Observable<number | null>;

  groupsToDisplay: number[] = []

  private destroy$ = new Subject<void>();
  
  constructor(
    private groupRepository: GroupRepositoryService,
    userInGroupRepository: UserInGroupService,
    private router: Router,
    private groupSyncService: GroupSyncService,
  ) {  
    this.sidenavOpened$ = groupSyncService.groupSelected$;
    this.sidenavGroupId$ = groupSyncService.groupId$;

    groupSyncService.refreshGroups$.pipe(
      takeUntil(this.destroy$),
      switchMap(() => userInGroupRepository.getByLoggedIn$())
    ).subscribe({
      next: (userGroupsResponses) => {
        this.groupsToDisplay = userGroupsResponses.map(x => x.group.id)
      }
    })
  }


  ngOnInit(): void {
    if (this.groupId) {
      this.groupRepository.isGroupExists$(this.groupId).subscribe({
        next: (exist) => {
          if (exist) {
            this.groupsToDisplay = [this.groupId!]
          } else {
            this.router.navigateByUrl("");
          }
        },
        error: () => {
          this.router.navigateByUrl("");
        }
      })
    } else {
      this.groupsToDisplay = [...this.userGroups]
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
