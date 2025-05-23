import { Component } from '@angular/core';

import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { MatMenuModule } from '@angular/material/menu';
import { JwtService } from '../services/jwt.service';
import { GroupHelper } from '../helpers/groupHelper';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { GroupRepositoryService } from '../services/group/groupRepository.service';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

export interface GroupSelected {
  id: number;
  name: string;
}

@Component({
  selector: 'app-toolbar',
  imports: [MatButtonModule, MatToolbarModule, MatIconModule, 
    MatMenuModule, AsyncPipe, MatCardModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  public groups$: Observable<GroupSelected[]>;
  constructor(
      private readonly jwtService: JwtService,
      private readonly groupRepository: GroupRepositoryService,
      private readonly cookieService: CookieService,
      private readonly router: Router) {
    this.groups$ = this.groupRepository.getByLoggedIn$().pipe(
      map(apiGroups => 
        apiGroups.map(apiGroup => ({
          id: apiGroup.id,
          name: GroupHelper.groupInfoToString(apiGroup),
        } as GroupSelected))
      ),
    );
  }

  isUserLogIn() : boolean {
    return this.jwtService.isTokenValid();
  }

  logout() {
    this.cookieService.delete("token");
    this.router.navigateByUrl("/login");
  }

  dialogForNewGroup() {
    console.log('new group');
  }

  onGroupSelected(id: number) {
    console.log(id);
  }
}
