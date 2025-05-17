import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GroupNameResponse } from '../login/dtos/groupNameResponse';
import { UserRepositoryService } from '../services/userRepository.service';
import {MatTableModule} from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { GroupHelper } from '../helpers/groupHelper';
import {MatIconModule} from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-groups',
  imports: [MatTableModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent {
  groups$: Observable<GroupNameResponse[]>;
  displayedColumns: string[] = ['name', 'startingYear', 'studyCourseName', 'studyLevel', 'studyMode', 'actions'];
  
  constructor(private userService: UserRepositoryService) {
    this.groups$ =  this.userService.getLoggedIn$().pipe(
      map(x => x.groups.map(y => y.groupInfo))
    );
   }

   getName(group: GroupNameResponse):string {
    return GroupHelper.groupInfoToString(group);
   }
}
