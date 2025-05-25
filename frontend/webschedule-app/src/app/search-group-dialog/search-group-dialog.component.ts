import { Component, ViewChild } from '@angular/core';
import { MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { distinctUntilChanged, map, Observable, shareReplay, startWith } from 'rxjs';
import { GroupRepositoryService } from '../services/group/groupRepository.service';
import { GroupHelper } from '../helpers/groupHelper';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { GroupInfoResponse } from '../services/group/dtos/groupInfoResponse';
import { MatChipSelectionChange, MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-search-group-dialog',
  imports: [MatDialogContent, MatDialogTitle,
    MatTableModule, MatMenuModule, MatIconModule, 
    MatButtonModule, CommonModule, MatProgressSpinnerModule,
    TranslatePipe, MatPaginator, MatPaginatorModule, MatChipsModule
  ],
  templateUrl: './search-group-dialog.component.html',
  styleUrl: './search-group-dialog.component.scss'
})
export class SearchGroupDialogComponent {

  isLoading = true;
  noData = false;
  groups?: MatTableDataSource<GroupInfoResponse>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'name', 'startingYear', 'studyCourseName', 'studyLevel', 
    'studyMode', 'subgroup', 'membersCount', 'join'];

  constructor(private groupService: GroupRepositoryService) {
    this.groupService.get$().subscribe({
      next: (groups => {
        this.isLoading = false;
        if (groups.length === 0) {
          this.noData = true;
          return;
        }
        this.groups = new MatTableDataSource<GroupInfoResponse>();
        this.groups.data = groups;
        setTimeout(() => this.groups!.paginator = this.paginator);
      })
    })
  }

  getName(group: GroupInfoResponse):string {
    return GroupHelper.groupInfoToString(group);
  }

  handleCandidateJoin(group: GroupInfoResponse, selected: boolean) {
    const index = this.getIndex(group.id);
    if (index == undefined)
      return;
    this.groups!.data[index].isCandidate = selected;
  }

  isCandidate(groupId: number) {
    const index = this.getIndex(groupId);
    if (index == undefined)
      return false;
    return this.groups!.data[index].isCandidate;
  }

  private getIndex(groupId: number){
    return this.groups?.data.findIndex((matGroup) => matGroup.id === groupId);
  }
}
