import { Component, OnInit } from '@angular/core';

import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { JwtService } from '../services/jwt.service';
import { UserRepositoryService } from '../services/userRepository.service';
import { GroupHelper } from '../helpers/groupHelper';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


export interface GroupSelected {
  name: string;
  checked: boolean;
}

@Component({
  selector: 'app-toolbar',
  imports: [MatButtonModule, MatToolbarModule, MatIconModule, MatMenuModule, MatCheckboxModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  constructor(
      private jwtService: JwtService,
      private userRepository: UserRepositoryService,
      private cookieService: CookieService,
      private router: Router) {}

  groups!: GroupSelected[]

  isUserLogIn() : boolean {
    return this.jwtService.isTokenValid();
  }

  loadGroups() {
    if (this.groups != undefined)
      return;
    this.userRepository.getLoggedIn$().subscribe({
      next: (userResponse) => {
        this.groups = userResponse.groups.map(x => ({
          name: GroupHelper.groupInfoToString(x.groupInfo),
          checked: true
        }) as GroupSelected);
      }
    })
  }
  update($event: MouseEvent, index: number) {
    this.groups[index].checked = !this.groups[index].checked;
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
