import { Component, ViewChild } from '@angular/core';
import { MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { distinctUntilChanged, map, Observable, shareReplay, startWith } from 'rxjs';
import { UserGroupResponse } from '../services/group/dtos/userGroupResponse';
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

  groups$: Observable<MatTableDataSource<UserGroupResponse>>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'startingYear', 'studyCourseName', 'studyLevel', 'studyMode', 'actions'];

  constructor(private groupService: GroupRepositoryService) {
    this.groups$ = this.groupService.getByLoggedIn$().pipe(
      map(groups => {
        const dataSource = new MatTableDataSource<UserGroupResponse>();
        dataSource.data = groups;
        dataSource.paginator = this.paginator;
        return dataSource;
      }),
      shareReplay({ bufferSize: 1, refCount: true })
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

  getName(group: UserGroupResponse):string {
    return GroupHelper.groupInfoToString(group);
  }
}
