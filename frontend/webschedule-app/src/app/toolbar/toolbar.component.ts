import { Component } from '@angular/core';

import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { JwtService } from '../services/jwt.service';
import { GroupHelper } from '../helpers/groupHelper';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { GroupRepositoryService } from '../services/group/groupRepository.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';


export interface GroupSelected {
  name: string;
  checked: boolean;
}

@Component({
  selector: 'app-toolbar',
  imports: [MatButtonModule, MatToolbarModule, MatIconModule, 
    MatMenuModule, MatCheckboxModule, AsyncPipe],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  groups$ = new BehaviorSubject<GroupSelected[]>([]);
  constructor(
      private jwtService: JwtService,
      private groupRepository: GroupRepositoryService,
      private cookieService: CookieService,
      private router: Router) {
        this.groupRepository.getByLoggedIn$().pipe(
          map(x => x. map(y => ({
            name: GroupHelper.groupInfoToString(y),
            checked: true
          }) as GroupSelected))
        ).subscribe({
          next: (groups) => {
            this.groups$.next(groups);
          }
        })
    }

  isUserLogIn() : boolean {
    return this.jwtService.isTokenValid();
  }

  update($event: MouseEvent, index: number) {
    const updatedGroups = this.groups$.getValue();
    updatedGroups[index].checked = !updatedGroups[index].checked;
    this.groups$.next(updatedGroups);
    $event.stopPropagation()
  }

  logout() {
    this.cookieService.delete("token");
    this.router.navigateByUrl("/login");
  }
  goToGroups() {
    this.router.navigateByUrl("/groups");
  }
}
