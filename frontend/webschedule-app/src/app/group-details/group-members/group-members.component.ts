import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserGroupResponse } from '../../../services/userInGroup/dtos/userGroupResponse';
import { UserInGroupService } from '../../../services/userInGroup/userInGroup.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SnackBarService } from '../../../services/snackBarService';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SyncService } from '../../../services/sync.service';
import { startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-group-members',
  imports: [
    CommonModule, MatProgressSpinnerModule, MatTableModule, MatPaginatorModule, MatChipsModule,
    MatSortModule
  ],
  templateUrl: './group-members.component.html',
  styleUrl: './group-members.component.scss'
})
export class GroupMembersComponent implements OnInit {
  @Input() userGroup?: UserGroupResponse

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  users?: MatTableDataSource<UserGroupResponse>;
  isLoading = true;
  noData = false;

  displayedColumns: string[] = ['displayName', 'role', 'delete'];

  constructor(
    private userInGroupRepository: UserInGroupService,
    private snackBarService: SnackBarService,
    private syncService: SyncService
  ) {
    
  }
  ngOnInit(): void {
    this.syncService.groupId$.pipe(
      startWith(this.userGroup?.group.id),
      switchMap((groupId) => this.userInGroupRepository.getByGroup$(groupId!, true))
    ).subscribe({
      next: (userGroupsResponse => {
        this.isLoading = false;
        if (userGroupsResponse.length === 0) {
          this.noData = true;
          return;
        }
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
        this.users.data = userGroupsResponse.filter(x => !x.isCandidate);
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

    this.users!.data = this.users!.data.map(g => 
          g.user.id === userGroup.user.id ? { ...g, isAdmin: selected} : g);


    // const result = selected ? this.userInGroupService.addCandidate$({
    //     groupId: userGroup.id
    //   }) : this.userInGroupService.disenrollFromGroup$({
    //     groupId: userGroup.id
    //   });
      
    // result.subscribe({
    //   next: () => {
    //     if (!this.users?.data)
    //       return;
    //     this.users.data = this.users!.data.map(g => 
    //       g.user.id === userGroup.user.id ? { ...g, isAdmin: selected} : g
    //     );
    //   },
    //   error:(err) => {
    //     this.snackBarService.openError(err);
    //     if (!this.users?.data)
    //       return;
    //     this.users.data = this.users!.data.map(g => 
    //       g.user.id === userGroup.user.id ? { ...g, isAdmin: !selected} : g
    //     );
    //   },
    // })
  }
}
