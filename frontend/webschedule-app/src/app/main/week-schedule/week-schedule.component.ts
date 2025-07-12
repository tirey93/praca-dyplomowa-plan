import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { GroupRepositoryService } from '../../../services/group/groupRepository.service';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavService } from '../../../services/sidenav.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-week-schedule',
  imports: [MatButtonModule, MatSidenavModule, AsyncPipe, MatIconModule],
  templateUrl: './week-schedule.component.html',
  styleUrl: './week-schedule.component.scss'
})
export class WeekScheduleComponent implements OnInit{
  @Input() userGroups: number[] = [];
  @Input() groupId?: number;
  sidenavOpened$: Observable<boolean>;

  groupsToDisplay: number[] = []
  constructor(
    private groupRepository: GroupRepositoryService,
    private router: Router,
    private sidenavService: SidenavService
  ) {  
    this.sidenavOpened$ = sidenavService.groupSelected$;
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

  closeSidenav() {
    this.sidenavService.unselectGroup();
  }
}
