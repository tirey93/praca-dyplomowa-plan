import { Component, ViewChild } from '@angular/core';
import { MatDialogContent } from '@angular/material/dialog';
import { GroupRepositoryService } from '../services/group/groupRepository.service';
import { GroupHelper } from '../helpers/groupHelper';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { GroupInfoResponse } from '../services/group/dtos/groupInfoResponse';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-search-group-dialog',
  imports: [MatDialogContent,
    MatTableModule, MatMenuModule, MatIconModule, 
    MatButtonModule, CommonModule, MatProgressSpinnerModule,
    TranslatePipe, MatPaginator, MatPaginatorModule, MatChipsModule,
    MatFormFieldModule, MatSelectModule, MatOptionModule
  ],
  templateUrl: './search-group-dialog.component.html',
  styleUrl: './search-group-dialog.component.scss'
})
export class SearchGroupDialogComponent {
  isLoading = true;
  noData = false;
  groups?: MatTableDataSource<GroupInfoResponse>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterDictionary= new Map<string,string>();
  filterOptionsMode = ['FullTime', 'PartTime']
  filterOptionsLevel = ['Bachelor', 'Master', 'Engineer']
  filterOptionsYear?: Set<number>

  displayedColumns: string[] = [
    'name', 'startingYear', 'studyCourseName', 'studyLevel', 
    'studyMode', 'subgroup', 'membersCount', 'join'];

  constructor(private groupService: GroupRepositoryService,
  ) {
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
    this.groups!.data[index].isCandidate = selected;
  }

  applyFilter(ob:MatSelectChange,empfilter: string) {
    this.filterDictionary.set(empfilter,ob.value);
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.groups!.filter = jsonString;
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
