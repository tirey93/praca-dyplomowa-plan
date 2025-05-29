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
import { filter, map, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ShowGroupDialogComponent } from '../show-group-dialog/show-group-dialog.component';
import { SearchGroupDialogComponent } from '../search-group-dialog/search-group-dialog.component';
import { ToolbarService } from '../services/toolbar/toolbar.service';
import { ToolbarConfig } from '../services/toolbar/toolbar-config';

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
  isLogin$: Observable<boolean>;
  groups$: Observable<GroupSelected[]>;
  constructor(
      readonly jwtService: JwtService,
      private readonly groupRepository: GroupRepositoryService,
      private readonly cookieService: CookieService,
      private readonly router: Router,
      private readonly dialog: MatDialog,
      private readonly toolbarService: ToolbarService) {
    this.isLogin$ = toolbarService.toolbarConfig$.pipe(map(x => x.isLogin));
    if (jwtService.isTokenValid()) {
      toolbarService.setToolbarConfig({isLogin: true})
    }
    this.groups$ = this.isLogin$.pipe(
      filter(x => x),
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
    this.cookieService.delete("token");
    this.toolbarService.setToolbarConfig({isLogin: false})
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
