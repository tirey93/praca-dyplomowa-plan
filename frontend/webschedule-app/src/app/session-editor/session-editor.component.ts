import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SessionDto } from '../dtos/sessionDto';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SyncService } from '../../services/sync.service';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { SessionInGroupResponse } from '../../services/session/dtos/sessionInGroupResponse';
import { SessionService } from '../../services/session/session.service';
import { WeekHelper } from '../../helpers/weekHelper';
import { UserInGroupService } from '../../services/userInGroup/userInGroup.service';
import { UserGroupResponse } from '../../services/userInGroup/dtos/userGroupResponse';

@Component({
  selector: 'app-session-editor',
  imports: [
    MatDividerModule, MatTableModule, MatProgressSpinnerModule, MatIconModule, CommonModule, MatButtonModule
  ],
  templateUrl: './session-editor.component.html',
  styleUrl: './session-editor.component.scss'
})
export class SessionEditorComponent implements OnInit, OnDestroy {
  isLoading = true;
  noData = false;
  displayedColumns: string[] = ['period', 'number'];
  sessions?: MatTableDataSource<SessionDto>;

  @Input() userGroup?: UserGroupResponse;
  @Input() creation = false;
  @Output() onSessionUpdate = new EventEmitter<SessionDto>();

  private destroy$ = new Subject<void>();
  
  constructor(
    private sessionService: SessionService,
    private syncService: SyncService,
  ) {
  }

  ngOnInit(): void {
    this.sessionService.getDefaults$().pipe(
      filter(() => this.creation)
    ).subscribe({
      next: (sessionsInGroupResponse) => {
        this.loadSession(sessionsInGroupResponse);
      }
    })

    this.syncService.groupId$.pipe(
      takeUntil(this.destroy$),
      filter(groupId => groupId != null && !this.creation),
      switchMap((groupId) => this.sessionService.getByGroup$(groupId!))
    ).subscribe({
      next: (sessionsInGroupResponse) => {
        this.loadSession(sessionsInGroupResponse);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.onSessionUpdate.emit({...sessionDto, weekNumber: this.getWeekNumber(sessionDto.weekNumber + 1)});
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
    this.onSessionUpdate.emit({...sessionDto, weekNumber: this.getWeekNumber(sessionDto.weekNumber - 1)});
  }

  private loadSession(sessionsInGroupResponse: SessionInGroupResponse[]) {
    this.isLoading = false;
    if (sessionsInGroupResponse.length === 0) {
      this.noData = true;
      return;
    }
    if (!this.userGroup?.isAdmin){
      this.displayedColumns = this.displayedColumns.filter(x => x !== 'up_down')
    }
    if(this.userGroup?.isAdmin && !this.displayedColumns.includes('up_down')) {
      this.displayedColumns.push('up_down');
    }
    this.sessions = new MatTableDataSource<SessionDto>();
    this.sessions.data = this.getDataForSessions(sessionsInGroupResponse.filter(x => x.springSemester === this.userGroup?.group?.springSemester));
  }

  private getWeekNumber(weekNumber: number): number {
    if (weekNumber > 52){
      return 1;
    } else if (weekNumber < 1) {
      return 52;
    } else {
      return weekNumber;
    }
  }
  
  

  private getDataForSessions(sessionsInGroupResponse: SessionInGroupResponse[]): SessionDto[] {
    const result: SessionDto[] = [];
    let currentSessionIndex = 0;
    let currentWeek = sessionsInGroupResponse[currentSessionIndex].weekNumber;
    const lastWeek = sessionsInGroupResponse[sessionsInGroupResponse.length - 1].weekNumber;

    result.push({
      index: result.length,
      period: WeekHelper.getPeriod(WeekHelper.getSaturdayOfWeek(currentWeek - 1)),
      weekNumber: currentWeek - 1
    })

    while(currentWeek !== lastWeek) {
      if (currentWeek === sessionsInGroupResponse[currentSessionIndex].weekNumber) {
        result.push({
          index: result.length,
          period: WeekHelper.getPeriod(WeekHelper.getSaturdayOfWeek(currentWeek)),
          number: sessionsInGroupResponse[currentSessionIndex].number,
          weekNumber: currentWeek
        })
        currentSessionIndex++;
      } else {
        result.push({
          index: result.length,
          period: WeekHelper.getPeriod(WeekHelper.getSaturdayOfWeek(currentWeek)),
          weekNumber: currentWeek
        })
      }

      const nextCurrentWeek = this.getWeekNumber(currentWeek + 1);
      currentWeek = nextCurrentWeek;
    }

    result.push({
      index: result.length,
      period: WeekHelper.getPeriod(WeekHelper.getSaturdayOfWeek(currentWeek)),
      number: sessionsInGroupResponse[currentSessionIndex].number,
      weekNumber: currentWeek
    })
    result.push({
      index: result.length,
      period: WeekHelper.getPeriod(WeekHelper.getSaturdayOfWeek(currentWeek + 1)),
      weekNumber: currentWeek + 1
    })
    result.push({
      index: result.length,
      period: WeekHelper.getPeriod(WeekHelper.getSaturdayOfWeek(currentWeek + 2)),
      weekNumber: currentWeek + 2
    })
    return result;
  }
}
