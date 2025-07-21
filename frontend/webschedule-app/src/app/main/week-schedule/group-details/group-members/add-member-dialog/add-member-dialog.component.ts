import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SnackBarService } from '../../../../../../services/snackBarService';
import { SyncService } from '../../../../../../services/sync.service';
import { UserRepositoryService } from '../../../../../../services/user/userRepository.service';
import { UserResponse } from '../../../../../../services/user/dtos/userResponse';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, groupBy, map, Observable, switchMap } from 'rxjs';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { UserGroupResponse } from '../../../../../../services/userInGroup/dtos/userGroupResponse';
import { GroupResponse } from '../../../../../../services/group/dtos/groupResponse';
import { GroupHelper } from '../../../../../../helpers/groupHelper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserInGroupService } from '../../../../../../services/userInGroup/userInGroup.service';
import { Role } from '../../../../../../helpers/roles';

@Component({
  selector: 'app-add-member-dialog',
  imports: [
    MatProgressSpinnerModule, CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatLabel, MatInputModule, MatAutocompleteModule, MatOptionModule, ReactiveFormsModule,
    MatDialogContent, MatDialogTitle, MatTooltipModule
  ],
  templateUrl: './add-member-dialog.component.html',
  styleUrl: './add-member-dialog.component.scss'
})
export class AddMemberDialogComponent implements OnInit{

  data = inject(DIALOG_DATA);
  userGroup: UserGroupResponse = this.data.userGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  users?: MatTableDataSource<UserResponse>;
  isLoading = true;
  noData = false;

  displayedColumns: string[] = ['displayName', 'add'];

  filterDictionary= new Map<string,string>();
  displayNameFilterControl = new FormControl<string>('');
  filteredOptionsDisplayName$: Observable<string[]>;
  filterOptionsDisplayName?: Set<string>;

  constructor(
    private userRepositoryService: UserRepositoryService,
    private userInGroupsService: UserInGroupService,
    private snackBarService: SnackBarService,
    private syncService: SyncService
  ) {
    this.filteredOptionsDisplayName$ = this.displayNameFilterControl.valueChanges.pipe(
      map(value => {
        return value ? this.filterOptionCourse(value) : [...this.filterOptionsDisplayName!].slice();
      }),
    );
  }

  ngOnInit(): void {
    forkJoin([this.userRepositoryService.get$(), this.userInGroupsService.getByGroup$(this.userGroup.group.id)])
    .subscribe({
      next: (([usersResponse, usersInGroup]) => {
        this.isLoading = false;
        if (usersResponse.length === 0) {
          this.noData = true;
          return;
        }
        this.users = new MatTableDataSource<UserResponse>();
        this.users.data = usersResponse
          .filter(x => !usersInGroup.map(u => u.user.id).includes(x.id))
          .sort((a, b) => a.displayName > b.displayName ? 1 : -1);

        this.filterOptionsDisplayName = new Set(this.users?.data.map(x => x.displayName).sort((a, b) => a > b ? 1 : -1));
        this.displayNameFilterControl.setValue('');

        this.users.filterPredicate = function (record,filter) {
            var map = new Map(JSON.parse(filter));
            let isMatch = false;
            for(let [key,value] of map){
              isMatch = (record[key as keyof UserResponse] == value); 
              if(!isMatch) return false;
            }
            return isMatch;
        }

        setTimeout(() => this.users!.paginator = this.paginator);
      }),
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  handleAddToGroup(user: UserResponse) {
    this.userInGroupsService.addCandidate$({groupId: this.userGroup.group.id, userId: user.id}).pipe(
      switchMap(() => this.userInGroupsService
        .changeRole$({groupId: this.userGroup.group.id, userId: user.id, role: Role.Student.toString()}))
    ).subscribe({
      next: () => {
        this.snackBarService.openMessage('AddMemberToGroupSuccess');
        this.users!.data = this.users!.data.filter(x => x.id !== user.id);
        this.syncService.selectGroup(this.userGroup.group.id)
      },
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  onClearAllFilters() {
    this.filterDictionary.clear();
    this.applyFilter(null, '');
    this.displayNameFilterControl.setValue('');
  }
  applyFilter(option:any, empfilter: string) {
    this.filterDictionary.set(empfilter, option);
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.users!.filter = jsonString;
  }

  getName(group: GroupResponse):string {
    return GroupHelper.groupInfoToString(group);
  }
  private filterOptionCourse(name: string): string[] {
    const filterValue = name.toLowerCase();
    return [...this.filterOptionsDisplayName!].filter(option => option.toLowerCase().includes(filterValue));
  }
}
