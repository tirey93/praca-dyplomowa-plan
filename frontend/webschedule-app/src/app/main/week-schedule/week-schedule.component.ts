import { Component, Input, OnInit } from '@angular/core';
import { UserResponse } from '../../../services/user/dtos/userResponse';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { UserRepositoryService } from '../../../services/user/userRepository.service';

@Component({
  selector: 'app-week-schedule',
  imports: [AsyncPipe, MatButtonModule],
  templateUrl: './week-schedule.component.html',
  styleUrl: './week-schedule.component.scss'
})
export class WeekScheduleComponent {
  @Input() groupName?: string;
  
  constructor(
    private userRepositoryService: UserRepositoryService) {
      
    }
}
