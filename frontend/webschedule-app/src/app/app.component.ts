import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import {MatMenuModule} from '@angular/material/menu';
import { JwtService } from './services/jwt.service';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { UserRepositoryService } from './services/userRepository.service';
import { GroupHelper } from './helpers/groupHelper';

export interface GroupSelected {
  name: string;
  checked: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, MatToolbarModule, MatIconModule, MatMenuModule, MatCheckboxModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  groups!: GroupSelected[]

  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepositoryService) {}


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
}
