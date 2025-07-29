import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SessionDto } from '../dtos/sessionDto';
import { SessionInGroupService } from '../../services/sessionInGroup/sessionInGroup.service';
import { SessionInGroupResponse } from '../../services/sessionInGroup/dtos/sessionInGroupResponse';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-session-editor',
  imports: [
    MatDividerModule, MatTableModule, MatProgressSpinnerModule, MatIconModule, CommonModule, MatButtonModule
  ],
  templateUrl: './session-editor.component.html',
  styleUrl: './session-editor.component.scss'
})
export class SessionEditorComponent implements OnInit {
  isLoading = true;
  noData = false;
  displayedColumns: string[] = ['period', 'number', 'up_down'];
  sessions?: MatTableDataSource<SessionDto>;

  @Input() springSemester = false;
  @Input() groupId?: number;
  @Output() onSessionUpdate = new EventEmitter<SessionDto[]>();

  constructor(
    private sessionInGroupService: SessionInGroupService
  ) {
  }

  ngOnInit(): void {
    const subscription = this.groupId 
      ? this.sessionInGroupService.getByGroup$(this.groupId)
      : this.sessionInGroupService.getDefaults$();

    subscription.subscribe({
      next: (sessionsInGroupResponse) => {
        this.isLoading = false;
        if (sessionsInGroupResponse.length === 0) {
          this.noData = true;
          return;
        }
        this.sessions = new MatTableDataSource<SessionDto>();
        this.sessions.data = this.getDataForSessions(sessionsInGroupResponse.filter(x => x.springSemester === this.springSemester));
      }
    })
  }

  private getSaturdayOfWeek(weekNumber: number, year: number = new Date().getFullYear()): Date {
      const januaryFirst = new Date(year, 0, 1);
      const dayOfWeek = januaryFirst.getDay();
      const firstMonday = new Date(januaryFirst);
      if (dayOfWeek <= 4) {
          firstMonday.setDate(januaryFirst.getDate() - dayOfWeek + 1);
      } else {
          firstMonday.setDate(januaryFirst.getDate() + 8 - dayOfWeek);
      }
      const saturday = new Date(firstMonday);
      saturday.setDate(firstMonday.getDate() + (weekNumber - 1) * 7 + 5);
      if (saturday < new Date()) {
        return this.getSaturdayOfWeek(weekNumber, year + 1);
      }
      return saturday;
  }

  canBeMoveDown(sessionDto: SessionDto): boolean {
    if (sessionDto.index === this.sessions!.data.length - 1) {
      return false;
    }
    if (this.sessions!.data[sessionDto.index + 1].number){
      return false;
    }
    return true;
  }
  canBeMoveUp(sessionDto: SessionDto): boolean {
    if (sessionDto.index === 0) {
      return false;
    }
    if (this.sessions!.data[sessionDto.index - 1].number){
      return false;
    }
    return true;
  }
  handleMoveDown(sessionDto: SessionDto) {
    const next = this.sessions!.data[sessionDto.index + 1];
    this.sessions!.data = this.sessions!.data.map(x => {
      if (x.index === sessionDto.index) {
        return {...x, number: next.number};
      }
      if (x.index == sessionDto.index + 1) {
        return {...x, number: sessionDto.number};
      }
      return x;
    });
    this.onSessionUpdate.emit(this.sessions!.data);
  }
  handleMoveUp(sessionDto: SessionDto) {
    const next = this.sessions!.data[sessionDto.index - 1];
    this.sessions!.data = this.sessions!.data.map(x => {
      if (x.index === sessionDto.index) {
        return {...x, number: next.number};
      }
      if (x.index == sessionDto.index - 1) {
        return {...x, number: sessionDto.number};
      }
      return x;
    });
    this.onSessionUpdate.emit(this.sessions!.data);
  }
  
  private getPeriod(date: Date): string {
    const saturday = date.getDate().toString().padStart(2, '0');
    const sundayFull = new Date(date.getTime() + (1000 * 60 * 60 * 24));
    const sunday = sundayFull.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${saturday}-${sunday}.${month}.${year}`
  }

  private getDataForSessions(sessionsInGroupResponse: SessionInGroupResponse[]): SessionDto[] {
    const result: SessionDto[] = [];
    let currentSessionIndex = 0;
    let currentWeek = sessionsInGroupResponse[currentSessionIndex].weekNumber;
    const lastWeek = sessionsInGroupResponse[sessionsInGroupResponse.length - 1].weekNumber;

    result.push({
      index: result.length,
      period: this.getPeriod(this.getSaturdayOfWeek(currentWeek - 1)),
      weekNumber: currentWeek - 1
    })

    while(currentWeek !== lastWeek) {
      if (currentWeek === sessionsInGroupResponse[currentSessionIndex].weekNumber) {
        result.push({
          index: result.length,
          period: this.getPeriod(this.getSaturdayOfWeek(currentWeek)),
          number: sessionsInGroupResponse[currentSessionIndex].number,
          weekNumber: currentWeek
        })
        currentSessionIndex++;
      } else {
        result.push({
          index: result.length,
          period: this.getPeriod(this.getSaturdayOfWeek(currentWeek)),
          weekNumber: currentWeek
        })
      }

      if (currentWeek === 52){
        currentWeek = 1
      } else {
        currentWeek++;
      }
    }

    result.push({
      index: result.length,
      period: this.getPeriod(this.getSaturdayOfWeek(currentWeek)),
      number: sessionsInGroupResponse[currentSessionIndex].number,
      weekNumber: currentWeek
    })
    result.push({
      index: result.length,
      period: this.getPeriod(this.getSaturdayOfWeek(currentWeek + 1)),
      weekNumber: currentWeek + 1
    })
    result.push({
      index: result.length,
      period: this.getPeriod(this.getSaturdayOfWeek(currentWeek + 2)),
      weekNumber: currentWeek + 2
    })
    return result;
  }
}
