import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { filter, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RemoveFromGroupDialogComponent } from './remove-from-group-dialog/remove-from-group-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CandidatesListComponent } from "./candidates-list/candidates-list.component";
import { AddMemberDialogComponent } from './add-member-dialog/add-member-dialog.component';
import { Role } from '../../../helpers/roles';
import { SnackBarService } from '../../../services/snackBarService';
import { SyncService } from '../../../services/sync.service';
import { UserGroupResponse } from '../../../services/userInGroup/dtos/userGroupResponse';
import { UserInGroupService } from '../../../services/userInGroup/userInGroup.service';

@Component({
  selector: 'app-group-members',
  imports: [
    CommonModule, MatProgressSpinnerModule, MatTableModule, MatPaginatorModule, MatChipsModule,
    MatSortModule, MatIconModule, MatButtonModule, MatExpansionModule,MatTooltipModule,
    CandidatesListComponent
],
  templateUrl: './group-members.component.html',
  styleUrl: './group-members.component.scss'
})
export class GroupMembersComponent implements OnInit, OnDestroy {
  userGroup?: UserGroupResponse

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  users?: MatTableDataSource<UserGroupResponse>;
  isLoading = true;
  noData = false;

  displayedColumns: string[] = ['displayName', 'role'];

  private destroy$ = new Subject<void>();
  
  constructor(
    private userInGroupRepository: UserInGroupService,
    private snackBarService: SnackBarService,
    private syncService: SyncService,
    private readonly dialog: MatDialog,
  ) {
    
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.syncService.currentUserGroup$.pipe(
      takeUntil(this.destroy$),
      filter(userGroup => userGroup != null),
      switchMap((userGroup) => {
        this.userGroup = userGroup;
        return this.userInGroupRepository.getByGroup$(userGroup.group.id, true)
      })).subscribe({
      next: (userGroupsResponse => {
        this.isLoading = false;
        if (userGroupsResponse.length === 0) {
          this.noData = true;
          return;
        }
        if (!this.userGroup?.isAdmin){
          this.displayedColumns = this.displayedColumns.filter(x => x !== 'delete')
        }
        if (this.userGroup?.isAdmin && !this.displayedColumns.includes('delete')) {
          this.displayedColumns.push('delete')
        }
        console.log(this.displayedColumns);
        if (!this.users) {
          this.users = new MatTableDataSource<UserGroupResponse>();
          this.users!.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'displayName': return item.user.displayName;
              case 'role': return item.isAdmin ? 1 : 0;
              default: return 0
            }
          }
          setTimeout(() => this.users!.paginator = this.paginator);
          setTimeout(() => this.users!.sort = this.sort!);
        }
        this.users.data = userGroupsResponse
          .filter(x => !x.isCandidate)
          .sort((a, b) => a.user.displayName > b.user.displayName ? 1 : -1);
        this.noData = false;
      }),
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  isAdmin(userId: number) {
    if (!this.users?.data)
          return;
    return this.users.data.find(g => g.user.id === userId)?.isAdmin;
  }

  handleAdminToggle(userGroup: UserGroupResponse, selected: boolean) {
    if (userGroup.isAdmin === selected)
      return;
    
    const role = selected ? Role.Admin.toString() : Role.Student.toString();
    this.userInGroupRepository.changeRole$({
        groupId: userGroup.group.id,
        userId: userGroup.user.id,
        role: role
      }).subscribe({
      next: () => {
        if (!this.users?.data)
          return;
        this.users.data = this.users!.data.map(g => 
          g.user.id === userGroup.user.id ? { ...g, isAdmin: selected} : g
        );
      },
      error:(err) => {
        this.snackBarService.openError(err);
        if (!this.users?.data)
          return;
        this.users.data = this.users!.data.map(g => 
          g.user.id === userGroup.user.id ? { ...g, isAdmin: !selected} : g
        );
      },
    })
  }

  removeFromGroup(userGroup: UserGroupResponse) {
    this.dialog.open(RemoveFromGroupDialogComponent, {
        data: {
          userGroup: userGroup
        },
      }).afterClosed().subscribe((result:boolean) => {
        if (result) {
          this.users!.data = this.users!.data.filter(x => x.user.id !== userGroup.user.id)
        }
      })
  }

  addToGroup() {
    this.dialog.open(AddMemberDialogComponent, {
        maxWidth: '100vw',
        autoFocus: false,
        data: {
          userGroup: this.userGroup
        },
      })
  }
}
