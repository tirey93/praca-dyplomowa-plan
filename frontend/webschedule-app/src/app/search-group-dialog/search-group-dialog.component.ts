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

@Component({
  selector: 'app-search-group-dialog',
  imports: [MatDialogContent, MatDialogTitle,
    MatTableModule, MatMenuModule, MatIconModule, 
    MatButtonModule, CommonModule, MatProgressSpinnerModule,
    TranslatePipe, MatPaginator, MatPaginatorModule
  ],
  templateUrl: './search-group-dialog.component.html',
  styleUrl: './search-group-dialog.component.scss'
})
export class SearchGroupDialogComponent {
  isLoading$: Observable<boolean>;
  noData$: Observable<boolean>;

  groups$: Observable<MatTableDataSource<GroupInfoResponse>>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'name', 'startingYear', 'studyCourseName', 'studyLevel', 
    'studyMode', 'subgroup', 'membersCount'];

  constructor(private groupService: GroupRepositoryService) {
    this.groups$ = this.groupService.get$().pipe(
      map(groups => {
        const dataSource = new MatTableDataSource<GroupInfoResponse>();
        dataSource.data = groups;
        dataSource.paginator = this.paginator;
        return dataSource;
      }),
    )
    this.isLoading$ = this.groups$.pipe(
      map(() => false),
      startWith(true),
      distinctUntilChanged()
    );
    this.noData$ = this.groups$.pipe(
      map((x) => x.data.length === 0),
      distinctUntilChanged()
    );
  }

  getName(group: GroupInfoResponse):string {
    return GroupHelper.groupInfoToString(group);
  }
}
