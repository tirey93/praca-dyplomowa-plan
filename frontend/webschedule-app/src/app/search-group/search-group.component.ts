import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserInGroupService } from '../../services/userInGroup/userInGroup.service';
import { SnackBarService } from '../../services/snackBarService';
import { GroupRepositoryService } from '../../services/group/groupRepository.service';
import { GroupHelper } from '../../helpers/groupHelper';
import { Constants } from '../../helpers/constants';
import { GroupInfoResponse } from '../../services/group/dtos/groupInfoResponse';
import { MatSort, MatSortModule } from '@angular/material/sort';


export interface CandidateGroupInfoResponse extends GroupInfoResponse {
    isCandidate: boolean,
}

@Component({
  selector: 'app-search-group',
  imports: [
    MatTableModule, MatMenuModule, MatIconModule, 
    MatButtonModule, CommonModule, MatProgressSpinnerModule,
    TranslatePipe, MatPaginator, MatPaginatorModule, MatChipsModule,
    MatFormFieldModule, MatSelectModule, MatOptionModule, MatAutocompleteModule,
    ReactiveFormsModule, MatInputModule, MatTooltipModule, MatSortModule
  ],
  templateUrl: './search-group.component.html',
  styleUrl: './search-group.component.scss'
})
export class SearchGroupComponent implements OnInit {
  @Input() hasJoinOption: boolean = false;
  @Input() pagesizeOptions: number[] = [10, 20, 50]

  isLoading = true;
  noData = false;
  groups?: MatTableDataSource<CandidateGroupInfoResponse>;

  courseFilterControl = new FormControl<string>('')
  yearFilterControl = new FormControl<string>('all')
  levelFilterControl = new FormControl<string>('all')

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  filterDictionary= new Map<string,string>();
  filterOptionsLevel = Constants.StudyLevels;
  filterOptionsYear?: Set<number>
  filteredOptionsCourse$: Observable<string[]>;
  filterOptionsCourse?: Set<string>;

  displayedColumns: string[] = [
    'name', 'startingYear', 'studyCourseName', 'studyLevel', 
    'subgroup', 'membersCount'];

  constructor(
    private groupService: GroupRepositoryService,
    private userInGroupService: UserInGroupService,
    private snackBarService: SnackBarService,
  ) {
    this.filteredOptionsCourse$ = this.courseFilterControl.valueChanges.pipe(
      map(value => {
        return value ? this.filterOptionCourse(value) : [...this.filterOptionsCourse!].slice();
      }),
    );
  }

  ngOnInit(): void {
    let subscription;
    if (this.hasJoinOption){
      subscription = forkJoin([this.userInGroupService.getCandidatesByLoggedIn$(), this.groupService.getGroups$(true)])
    } else {
      subscription = forkJoin([of([]), this.groupService.getGroups$()])
    }
    
    subscription.subscribe({
      next: (([candidates, groups]) => {
        this.isLoading = false;
        if (groups.length === 0) {
          this.noData = true;
          return;
        }
        if (this.hasJoinOption && !this.displayedColumns.includes('join')) {
          this.displayedColumns.push('join')
        }
        this.groups = new MatTableDataSource<CandidateGroupInfoResponse>();
        this.groups.data = groups.map(g => { 
           const result = g as CandidateGroupInfoResponse;
           result.isCandidate = candidates.some(x => x.group.id === g.id)
           return result;
        }).sort((a, b) => a.isCandidate ? -1 : 1);
        this.filterOptionsYear = new Set(this.groups?.data.map(x => x.startingYear).sort((a, b) => a - b))
        this.filterOptionsCourse = new Set(this.groups?.data.map(x => x.studyCourseName).sort((a, b) => a > b ? 1 : -1))
        this.courseFilterControl.setValue('')
        this.groups!.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'name': return this.getName(item);
            case 'startingYear': return item.startingYear;
            case 'studyCourseName': return item.studyCourseName;
            case 'studyLevel': return item.studyLevel;
            case 'subgroup': return item.subgroup;
            case 'membersCount': return item.membersCount;
            default: return 0
          }
        }
        setTimeout(() => this.groups!.paginator = this.paginator);
        setTimeout(() => this.groups!.sort = this.sort!);

        this.groups.filterPredicate = function (record,filter) {
            var map = new Map(JSON.parse(filter));
            let isMatch = false;
            for(let [key,value] of map){
              isMatch = (value=="all") || (record[key as keyof CandidateGroupInfoResponse] == value); 
              if(!isMatch) return false;
            }
            return isMatch;
        }
      }),
      error: (err) => {
        this.noData = true;
        this.isLoading = false;
        this.snackBarService.openError(err);
      },
    })
  }

  getName(group: CandidateGroupInfoResponse):string {
    return GroupHelper.groupInfoToString(group);
  }
  getLink(group: CandidateGroupInfoResponse) {
    return `/group/${group.id}`;
  }

  applyFilter(option:any, empfilter: string) {
    this.filterDictionary.set(empfilter, option);
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.groups!.filter = jsonString;
  }

  onClearAllFilters() {
    this.filterDictionary.clear();
    this.applyFilter(null, '')
    this.courseFilterControl.setValue('')
    this.yearFilterControl.setValue('all')
    this.levelFilterControl.setValue('all')
  }

  handleCandidateJoin(group: CandidateGroupInfoResponse, selected: boolean) {
    if (group.isCandidate === selected)
      return;

    const result = selected ? this.userInGroupService.addCandidate$({
        groupId: group.id
      }) : this.userInGroupService.disenrollFromGroup$({
        groupId: group.id
      });
      
    result.subscribe({
      next: () => {
        if (!this.groups?.data)
          return;
        this.groups.data = this.groups!.data.map(g => 
          g.id === group.id ? { ...g, isCandidate: selected} : g
        );
      },
      error:(err) => {
        this.snackBarService.openError(err);
        if (!this.groups?.data)
          return;
        this.groups.data = this.groups!.data.map(g => 
          g.id === group.id ? { ...g, isCandidate: !selected} : g
        );
      },
    })
  }
  
  isCandidate(groupId: number) {
    if (!this.groups?.data)
          return;
    return this.groups.data.find(g => g.id === groupId)?.isCandidate;
  }

  private filterOptionCourse(name: string): string[] {
    const filterValue = name.toLowerCase();
    return [...this.filterOptionsCourse!].filter(option => option.toLowerCase().includes(filterValue));
  }
}
