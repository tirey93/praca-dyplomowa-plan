import { Component } from '@angular/core';
import { WeekScheduleComponent } from "./week-schedule/week-schedule.component";
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { GroupChooserComponent } from "./group-chooser/group-chooser.component";
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-main',
  imports: [WeekScheduleComponent, AsyncPipe, GroupChooserComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  loggedUser$: Observable<boolean>;
    
    constructor(
      loginService: LoginService) {
        this.loggedUser$ = loginService.isLoggedIn$;
    }
}
