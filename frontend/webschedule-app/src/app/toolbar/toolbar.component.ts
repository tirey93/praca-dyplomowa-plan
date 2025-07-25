import { Component } from '@angular/core';

import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { filter, map, Observable, startWith, Subject, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { SearchGroupDialogComponent } from '../search-group-dialog/search-group-dialog.component';
import { LoginService } from '../../services/login.service';
import { MatTooltip } from '@angular/material/tooltip';
import { GroupHelper } from '../../helpers/groupHelper';
import { PreferencesComponent } from '../preferences/preferences.component';
import { SyncService } from '../../services/sync.service';
import { UserInGroupService } from '../../services/userInGroup/userInGroup.service';

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
      private readonly userInGroupRepository: UserInGroupService,
      private readonly router: Router,
      private readonly dialog: MatDialog,
      public readonly loginService: LoginService,
      private syncService: SyncService
    ) {
    loginService.refreshLogin();
    this.groups$ = this.syncService.refreshGroups$.pipe(
      startWith(undefined), switchMap(() => {
        return this.loginService.isLoggedIn$.pipe(
          filter(isLoggedIn => isLoggedIn),
          switchMap(() => {
            return this.userInGroupRepository.getByLoggedIn$().pipe(
              map(userGroups => 
                userGroups
                .filter(x => !x.isCandidate)
                .map(userGroup => ({
                  id: userGroup.group.id,
                  name: GroupHelper.groupInfoToString(userGroup.group),
                } as GroupSelected))
              ),
            )
          })
        )
      })
    );
  }
  goToPreferences() {
    this.dialog.open(PreferencesComponent, {
      maxWidth: '100vw',
      autoFocus: false
    })
  }
  logout() {
    this.loginService.logout();
    this.syncService.unselectGroup();
    this.login();
  }

  login() {
    this.router.navigateByUrl("/login");
  }
  onHomeClick() {
    this.router.navigateByUrl("");
  }

  onGroupSearch() {
    this.dialog.open(SearchGroupDialogComponent, {
      maxWidth: '100vw',
      autoFocus: false
    }).afterClosed().subscribe({
      next:(result:boolean) => {
        if(result)
          this.syncService.refreshGroups$.next();
      }
    });
  }

  onGroupSelected(id: number) {
    this.syncService.selectGroup(id);
  }
}
