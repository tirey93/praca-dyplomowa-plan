import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { GroupRepositoryService } from '../../../services/group/groupRepository.service';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-week-schedule',
  imports: [MatButtonModule, MatSidenavModule],
  templateUrl: './week-schedule.component.html',
  styleUrl: './week-schedule.component.scss'
})
export class WeekScheduleComponent implements OnInit{

  @Input() userGroups: number[] = [];
  @Input() groupId?: number;

  groupsToDisplay: number[] = []
  constructor(
    private groupRepository: GroupRepositoryService,
    private router: Router,
  ) {  
    
  }

  ngOnInit(): void {
    if (this.groupId) {
      this.groupRepository.isGroupExists$(this.groupId).subscribe({
        next: (exist) => {
          if (exist) {
            this.groupsToDisplay = [this.groupId!]
          } else {
            this.router.navigateByUrl("");
          }
        },
        error: () => {
          this.router.navigateByUrl("");
        }
      })
    } else {
      this.groupsToDisplay = [...this.userGroups]
    }
  }
}
