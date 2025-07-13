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
    private snackBarService: SnackBarService
  ) {
    
  }
  ngOnInit(): void {
    this.userInGroupRepository.getByGroup$(this.userGroup?.group.id, true).subscribe({
      next: (userGroupsResponse => {
        this.isLoading = false;
        if (userGroupsResponse.length === 0) {
          this.noData = true;
          return;
        }
        this.users = new MatTableDataSource<UserGroupResponse>();
        this.users.data = userGroupsResponse.filter(x => !x.isCandidate);
        this.users!.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'displayName': return item.user.displayName;
            case 'role': return item.isAdmin ? 1 : 0;
            default: return 0
          }
        }
        setTimeout(() => this.users!.paginator = this.paginator);
        setTimeout(() => this.users!.sort = this.sort!);
      }),
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }
}
