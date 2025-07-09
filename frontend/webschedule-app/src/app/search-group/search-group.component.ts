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
import { UserInGroupService } from '../../services/userInGroup/user-in-group.service';
import { SnackBarService } from '../../services/snackBarService';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';
import { GroupRepositoryService } from '../../services/group/groupRepository.service';
import { GroupHelper } from '../../helpers/groupHelper';
import { Constants } from '../../helpers/constants';
import { GroupInfoResponse } from '../../services/group/dtos/groupInfoResponse';

@Component({
  selector: 'app-search-group',
  imports: [
    MatTableModule, MatMenuModule, MatIconModule, 
    MatButtonModule, CommonModule, MatProgressSpinnerModule,
    TranslatePipe, MatPaginator, MatPaginatorModule, MatChipsModule,
    MatFormFieldModule, MatSelectModule, MatOptionModule, MatAutocompleteModule,
    ReactiveFormsModule, MatInputModule, MatTooltipModule,
  ],
  templateUrl: './search-group.component.html',
  styleUrl: './search-group.component.scss'
})
export class SearchGroupComponent {

  isLoading = true;
  noData = false;
  groups?: MatTableDataSource<GroupInfoResponse>;

  courseFilterControl = new FormControl<string>('')
  yearFilterControl = new FormControl<string>('all')
  levelFilterControl = new FormControl<string>('all')
  modefilterControl = new FormControl<string>('all')

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterDictionary= new Map<string,string>();
  filterOptionsMode = Constants.StudyModes;
  filterOptionsLevel = Constants.StudyLevels;
  filterOptionsYear?: Set<number>
  filteredOptionsCourse$: Observable<string[]>;
  filterOptionsCourse?: Set<string>;



  displayedColumns: string[] = [
    'name', 'startingYear', 'studyCourseName', 'studyLevel', 
    'studyMode', 'subgroup', 'membersCount'];

  constructor(
    private groupService: GroupRepositoryService,
    private snackBarService: SnackBarService,
  ) {
    this.filteredOptionsCourse$ = this.courseFilterControl.valueChanges.pipe(
      map(value => {
        return value ? this.filterOptionCourse(value) : [...this.filterOptionsCourse!].slice();
      }),
    );
    this.groupService.getGroups$().subscribe({
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
      }),
      error: (err) => {
        this.snackBarService.openError(err);
      },
    })
  }

  getName(group: GroupInfoResponse):string {
    return GroupHelper.groupInfoToString(group);
  }
  getLink(group: GroupInfoResponse) {
    const name = this.getName(group);
    return `/group/${name}`;
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

  private filterOptionCourse(name: string): string[] {
    const filterValue = name.toLowerCase();
    return [...this.filterOptionsCourse!].filter(option => option.toLowerCase().includes(filterValue));
  }
}
