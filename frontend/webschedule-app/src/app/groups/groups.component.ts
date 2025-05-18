import { Component } from '@angular/core';
import { distinctUntilChanged, map, Observable, shareReplay, startWith } from 'rxjs';
import {MatTableModule} from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { GroupHelper } from '../helpers/groupHelper';
import {MatIconModule} from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { UserGroupResponse } from '../services/group/dtos/userGroupResponse';
import { GroupRepositoryService } from '../services/group/groupRepository.service';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-groups',
  imports: [MatTableModule, MatMenuModule, MatIconModule, 
    MatButtonModule, CommonModule, MatProgressSpinnerModule,
    TranslatePipe
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent {
  isLoading$: Observable<boolean>;
  noData$: Observable<boolean>;
  groups$: Observable<UserGroupResponse[]>;
  displayedColumns: string[] = ['name', 'startingYear', 'studyCourseName', 'studyLevel', 'studyMode', 'actions'];
  
  constructor(private groupService: GroupRepositoryService) {
    this.groups$ = this.groupService.getByLoggedIn$().pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    )
    this.isLoading$ = this.groups$.pipe(
      map(() => false),
      startWith(true),
      distinctUntilChanged()
    );
    this.noData$ = this.groups$.pipe(
      map((x) => x.length === 0),
      distinctUntilChanged()
    );
   }

   getName(group: UserGroupResponse):string {
    return GroupHelper.groupInfoToString(group);
   }
}
