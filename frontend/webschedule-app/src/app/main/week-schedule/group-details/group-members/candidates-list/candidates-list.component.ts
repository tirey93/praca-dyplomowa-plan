import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserInGroupService } from '../../../../../../services/userInGroup/userInGroup.service';
import { SnackBarService } from '../../../../../../services/snackBarService';
import { UserGroupResponse } from '../../../../../../services/userInGroup/dtos/userGroupResponse';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Role } from '../../../../../../helpers/roles';
import { SyncService } from '../../../../../../services/sync.service';

@Component({
  selector: 'app-candidates-list',
  imports: [
    MatProgressSpinnerModule, CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './candidates-list.component.html',
  styleUrl: './candidates-list.component.scss'
})
export class CandidatesListComponent implements OnInit{
  @Input() groupId?: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  candidates?: MatTableDataSource<UserGroupResponse>;
  isLoading = true;
  noData = false;

  displayedColumns: string[] = ['displayName', 'approve', 'reject'];

    constructor(
    private userInGroupRepository: UserInGroupService,
    private snackBarService: SnackBarService,
    private syncService: SyncService
  ) {    
  }

  ngOnInit(): void {
    this.userInGroupRepository.getGroupCandidates$(this.groupId!).subscribe({
      next: (userGroupsResponse => {
        this.isLoading = false;
        if (userGroupsResponse.length === 0) {
          this.noData = true;
          return;
        }
        this.candidates = new MatTableDataSource<UserGroupResponse>();
        this.candidates.data = userGroupsResponse.sort((a, b) => a.user.displayName > b.user.displayName ? 1 : -1);
        setTimeout(() => this.candidates!.paginator = this.paginator);
      }),
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  handleApprove(userGroup: UserGroupResponse) {
    this.userInGroupRepository.changeRole$({ groupId: userGroup.group.id, userId: userGroup.user.id, role: Role.Student.toString() }).subscribe({
      next: () => {
        this.snackBarService.openMessage('ApproveCandidateToGroupSuccess');
        this.candidates!.data = this.candidates!.data.filter(x => x.user.id !== userGroup.user.id);
        this.syncService.selectGroup(userGroup.group.id)
      },
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  handleReject(userGroup: UserGroupResponse) {
    this.userInGroupRepository.disenrollFromGroup$({ groupId: userGroup.group.id, userId: userGroup.user.id }).subscribe({
      next: () => {
        this.snackBarService.openMessage('RemoveCandidateFromGroupSuccess');
        this.candidates!.data = this.candidates!.data.filter(x => x.user.id !== userGroup.user.id)
      },
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }
}
