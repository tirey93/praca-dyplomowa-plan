import { Component } from '@angular/core';
import { distinctUntilChanged, finalize, map, Observable, shareReplay, startWith } from 'rxjs';
import { GroupNameResponse } from '../login/dtos/groupNameResponse';
import { UserRepositoryService } from '../services/userRepository.service';
import {MatTableModule} from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { GroupHelper } from '../helpers/groupHelper';
import {MatIconModule} from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-groups',
  imports: [MatTableModule, MatMenuModule, MatIconModule, 
    MatButtonModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent {
  isLoading$: Observable<boolean>;
  noData$: Observable<boolean>;
  groups$: Observable<GroupNameResponse[]>;
  displayedColumns: string[] = ['name', 'startingYear', 'studyCourseName', 'studyLevel', 'studyMode', 'actions'];
  
  constructor(private userService: UserRepositoryService) {
    const userResponseSource$ = this.userService.getLoggedIn$().pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    )
    this.groups$ =  userResponseSource$.pipe(
      finalize(() => {
        console.log();
      }),
      map(x => x.groups.map(y => y.groupInfo))
    );
    this.isLoading$ = userResponseSource$.pipe(
      map(() => false),
      startWith(true),
      distinctUntilChanged()
    );
    this.noData$ = this.groups$.pipe(
      map((x) => x.length === 0),
      distinctUntilChanged()
    );
   }

   getName(group: GroupNameResponse):string {
    return GroupHelper.groupInfoToString(group);
   }
}
