import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalRService } from '../../../../../services/signalr.service';
import { CommonModule } from '@angular/common';
import { SyncService } from '../../../../../services/sync.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnDestroy{
  private destroy$ = new Subject<void>();

  constructor(
    public signalRService: SignalRService,
    syncService: SyncService
  ) {
    this.signalRService.startConnection();
    syncService.groupSelected$.pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (selected) => {
        if (selected) {
          this.signalRService.unsubscribe();
          this.signalRService.addNotificationListener();
        } else {
          this.signalRService.unsubscribe();
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
