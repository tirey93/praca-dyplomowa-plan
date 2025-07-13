import { Component, ViewChild } from '@angular/core';
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
import { map, Observable } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserInGroupService } from '../../services/userInGroup/userInGroup.service';
import { SnackBarService } from '../../services/snackBarService';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';
import { GroupRepositoryService } from '../../services/group/groupRepository.service';
import { GroupHelper } from '../../helpers/groupHelper';
import { Constants } from '../../helpers/constants';
import { CandidateGroupInfoResponse } from '../../services/group/dtos/candidateGroupInfoResponse';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-search-group-dialog',
  imports: [MatDialogContent,
    MatTableModule, MatMenuModule, MatIconModule, 
    MatButtonModule, CommonModule, MatProgressSpinnerModule,
    TranslatePipe, MatPaginator, MatPaginatorModule, MatChipsModule,
    MatFormFieldModule, MatSelectModule, MatOptionModule, MatAutocompleteModule,
    ReactiveFormsModule, MatInputModule, MatTooltipModule, MatDialogTitle,
    MatSortModule
  ],
  templateUrl: './search-group-dialog.component.html',
  styleUrl: './search-group-dialog.component.scss'
})
export class SearchGroupDialogComponent {
  isLoading = true;
  noData = false;
  groups?: MatTableDataSource<CandidateGroupInfoResponse>;

  courseFilterControl = new FormControl<string>('')
  yearFilterControl = new FormControl<string>('all')
  levelFilterControl = new FormControl<string>('all')
  modefilterControl = new FormControl<string>('all')

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  filterDictionary= new Map<string,string>();
  filterOptionsMode = Constants.StudyModes;
  filterOptionsLevel = Constants.StudyLevels;
  filterOptionsYear?: Set<number>
  filteredOptionsCourse$: Observable<string[]>;
  filterOptionsCourse?: Set<string>;



  displayedColumns: string[] = [
    'name', 'startingYear', 'studyCourseName', 'studyLevel', 
    'studyMode', 'subgroup', 'membersCount', 'join'];

  constructor(
    private groupService: GroupRepositoryService,
    private userInGroupService: UserInGroupService,
    private snackBarService: SnackBarService,
    private readonly dialog: MatDialog,
    private dialogRef: MatDialogRef<SearchGroupDialogComponent>
  ) {
    this.filteredOptionsCourse$ = this.courseFilterControl.valueChanges.pipe(
      map(value => {
        return value ? this.filterOptionCourse(value) : [...this.filterOptionsCourse!].slice();
      }),
    );
    this.groupService.getCandidateGroups$().subscribe({
      next: (groups => {
        this.isLoading = false;
        if (groups.length === 0) {
          this.noData = true;
          return;
        }
        this.groups = new MatTableDataSource<CandidateGroupInfoResponse>();
        this.groups.data = groups;
        this.filterOptionsYear = new Set(this.groups?.data.map(x => x.startingYear).sort((a, b) => a - b))
        this.filterOptionsCourse = new Set(this.groups?.data.map(x => x.studyCourseName).sort((a, b) => a > b ? 1 : -1))
        this.courseFilterControl.setValue('')
        this.groups!.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'name': return this.getName(item);
            case 'startingYear': return item.startingYear;
            case 'studyCourseName': return item.studyCourseName;
            case 'studyLevel': return item.studyLevel;
            case 'studyMode': return item.studyMode;
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
        this.snackBarService.openError(err);
      },
    })
  }

  getName(group: CandidateGroupInfoResponse):string {
    return GroupHelper.groupInfoToString(group);
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

  handleCreateNewGroup() {
    this.dialog.open(CreateGroupDialogComponent, {
      maxWidth: '100vw',
      autoFocus: false
    }).afterClosed().subscribe((result:boolean) => {
      if(result)
        this.dialogRef.close(result);
    })
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
    this.modefilterControl.setValue('all')
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
