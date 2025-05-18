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
import { BehaviorSubject, map, Observable, scan, shareReplay, startWith, switchMap } from 'rxjs';
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
  public groups$: Observable<GroupSelected[]>;
  public toggleGroupAction$ = new BehaviorSubject<number>(0); // Emituje ID grupy do przełączenia

  constructor(
      private jwtService: JwtService,
      private groupRepository: GroupRepositoryService,
      private cookieService: CookieService,
      private router: Router) {
    const initialGroupsLoad$ = this.groupRepository.getByLoggedIn$().pipe(
      map(apiGroups =>
        apiGroups.map(apiGroup => ({
          id: apiGroup.id,
          name: GroupHelper.groupInfoToString(apiGroup),
          checked: true,
          originalData: apiGroup
        } as GroupSelected))
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.groups$ = initialGroupsLoad$.pipe(
      switchMap(initialGroups => {
        return this.toggleGroupAction$.pipe(
          scan((accGroups: GroupSelected[], groupIdToToggle: number) => {
              accGroups[groupIdToToggle].checked = !accGroups[groupIdToToggle].checked;
              return accGroups;
          }, initialGroups),
          startWith(initialGroups)
        );
      }),
    );
  }

  isUserLogIn() : boolean {
    return this.jwtService.isTokenValid();
  }

  update($event: MouseEvent, index: number) {
    this.toggleGroupAction$.next(index);
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
