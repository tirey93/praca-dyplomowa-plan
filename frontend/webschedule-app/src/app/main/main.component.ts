import { Component, Input } from '@angular/core';
import { WeekScheduleComponent } from "./week-schedule/week-schedule.component";
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { SearchGroupComponent } from "../search-group/search-group.component";

@Component({
  selector: 'app-main',
  imports: [WeekScheduleComponent, AsyncPipe, SearchGroupComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  loggedUser$: Observable<boolean>;
  @Input() groupName?: string;

  constructor(
    loginService: LoginService) {
      this.loggedUser$ = loginService.isLoggedIn$;
  }
}
