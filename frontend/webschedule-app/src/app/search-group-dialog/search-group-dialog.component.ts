import { Component, ViewChild } from '@angular/core';
import { MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserInGroupService } from '../services/userInGroup/user-in-group.service';

@Component({
  selector: 'app-search-group-dialog',
  imports: [MatDialogContent,
    MatTableModule, MatMenuModule, MatIconModule, 
    MatButtonModule, CommonModule, MatProgressSpinnerModule,
    TranslatePipe, MatPaginator, MatPaginatorModule, MatChipsModule,
    MatFormFieldModule, MatSelectModule, MatOptionModule, MatAutocompleteModule,
    ReactiveFormsModule, MatInputModule, MatTooltipModule, MatDialogTitle
  ],
  templateUrl: './search-group-dialog.component.html',
  styleUrl: './search-group-dialog.component.scss'
})
export class SearchGroupDialogComponent {
  isLoading = true;
  noData = false;
  groups?: MatTableDataSource<GroupInfoResponse>;

  courseFilterControl = new FormControl<string>('')
  yearFilterControl = new FormControl<string>('all')
  levelFilterControl = new FormControl<string>('all')
  modefilterControl = new FormControl<string>('all')

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterDictionary= new Map<string,string>();
  filterOptionsMode = ['FullTime', 'PartTime']
  filterOptionsLevel = ['Bachelor', 'Master', 'Engineer']
  filterOptionsYear?: Set<number>
  filteredOptionsCourse$: Observable<string[]>;
  filterOptionsCourse?: Set<string>;



  displayedColumns: string[] = [
    'name', 'startingYear', 'studyCourseName', 'studyLevel', 
    'studyMode', 'subgroup', 'membersCount', 'join'];

  constructor(
    private groupService: GroupRepositoryService,
    private userInGroupService: UserInGroupService
  ) {
    this.filteredOptionsCourse$ = this.courseFilterControl.valueChanges.pipe(
      map(value => {
        return value ? this.filterOptionCourse(value) : [...this.filterOptionsCourse!].slice();
      }),
    );
    this.groupService.get$().subscribe({
      next: (groups => {
        this.isLoading = false;
        if (groups.length === 0) {
          this.noData = true;
          return;
        }
        this.groups = new MatTableDataSource<GroupInfoResponse>();
        this.groups.data = groups;
        this.filterOptionsYear = new Set(this.groups?.data.map(x => x.startingYear).sort((a, b) => a - b))
        this.filterOptionsCourse = new Set(this.groups?.data.map(x => x.studyCourseName).sort((a, b) => a > b ? 1 : -1))
        this.courseFilterControl.setValue('')
        setTimeout(() => this.groups!.paginator = this.paginator);
        
        this.groups.filterPredicate = function (record,filter) {
            var map = new Map(JSON.parse(filter));
            let isMatch = false;
            for(let [key,value] of map){
              isMatch = (value=="all") || (record[key as keyof GroupInfoResponse] == value); 
              if(!isMatch) return false;
            }
            return isMatch;
        }
      })
    })
  }

  getName(group: GroupInfoResponse):string {
    return GroupHelper.groupInfoToString(group);
  }

  handleCandidateJoin(group: GroupInfoResponse, selected: boolean) {
    if (group.isCandidate === selected)
      return;
    const index = this.getIndex(group.id);
    if (index == undefined)
      return;

    let result: Observable<Object>;
    if (selected) {
      result = this.addCandidate(this.groups!.data[index].id);
    } else {
      result = this.disenrollUser(this.groups!.data[index].id);
    }    

    result.subscribe({
      next: () => {
        console.log('success');
        this.groups!.data[index].isCandidate = selected;
      },
      error(err) {
        console.log('error', err);
      },
    })
  }

  private addCandidate(groupId: number) {
    return this.userInGroupService.addCandidate$({
      groupId: groupId
    })
  }
  private disenrollUser(groupId: number) {
    return this.userInGroupService.disenrollFromGroup$({
      groupId: groupId
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
    const index = this.getIndex(groupId);
    if (index == undefined)
      return false;
    return this.groups!.data[index].isCandidate;
  }

  private getIndex(groupId: number){
    return this.groups?.data.findIndex((matGroup) => matGroup.id === groupId);
  }

  private filterOptionCourse(name: string): string[] {
    const filterValue = name.toLowerCase();
    return [...this.filterOptionsCourse!].filter(option => option.toLowerCase().includes(filterValue));
  }
}
