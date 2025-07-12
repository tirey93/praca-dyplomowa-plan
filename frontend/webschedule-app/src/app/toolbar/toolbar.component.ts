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
import { GroupRepositoryService } from '../../services/group/groupRepository.service';
import { GroupHelper } from '../../helpers/groupHelper';
import { PreferencesComponent } from '../preferences/preferences.component';
import { SidenavService } from '../../services/sidenav.service';

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
  refeshGroups$ = new Subject<void>();
  constructor(
      private readonly groupRepository: GroupRepositoryService,
      private readonly router: Router,
      private readonly dialog: MatDialog,
      public readonly loginService: LoginService,
      private sidenavService: SidenavService
    ) {
    loginService.refreshLogin();
    this.groups$ = this.refeshGroups$.pipe(
      startWith(undefined), switchMap(() => {
        return this.loginService.isLoggedIn$.pipe(
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
          this.refeshGroups$.next();
      }
    });
  }

  onGroupSelected(id: number) {
    this.sidenavService.selectGroup(id);
  }
}
