import { Component } from '@angular/core';

import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { MatMenuModule } from '@angular/material/menu';
import { GroupHelper } from '../helpers/groupHelper';
import { Router } from '@angular/router';
import { GroupRepositoryService } from '../services/group/groupRepository.service';
import { filter, map, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ShowGroupDialogComponent } from '../show-group-dialog/show-group-dialog.component';
import { SearchGroupDialogComponent } from '../search-group-dialog/search-group-dialog.component';
import { LoginService } from '../services/login/login.service';
import { MatTooltip } from '@angular/material/tooltip';

export interface GroupSelected {
  id: number;
  name: string;
}

@Component({
  selector: 'app-toolbar',
  imports: [MatButtonModule, MatToolbarModule, MatIconModule, 
    MatMenuModule, AsyncPipe, MatCardModule, MatTooltip],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  groups$: Observable<GroupSelected[]>;
  constructor(
      private readonly groupRepository: GroupRepositoryService,
      private readonly router: Router,
      private readonly dialog: MatDialog,
      public readonly loginService: LoginService) {
    loginService.refreshLogin();
    this.groups$ = this.loginService.isLoggedIn$.pipe(
      filter(isLoggedIn => isLoggedIn),
      switchMap(() => {
        return this.groupRepository.getByLoggedIn$().pipe(
          map(apiGroups => 
            apiGroups.map(apiGroup => ({
              id: apiGroup.id,
              name: GroupHelper.groupInfoToString(apiGroup),
            } as GroupSelected))
          ),
        )
      })
    )
  }

  logout() {
    this.loginService.logout();
    this.router.navigateByUrl("/login");
  }

  onGroupSearch() {
    this.dialog.open(SearchGroupDialogComponent, {
      maxWidth: '100vw',
      autoFocus: false
    });
  }

  onGroupSelected(id: number) {
    this.dialog.open<ShowGroupDialogComponent, number>(ShowGroupDialogComponent, { data: id });
  }
}
