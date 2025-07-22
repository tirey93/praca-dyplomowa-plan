import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalRService } from '../../../../../services/signalr.service';
import { CommonModule } from '@angular/common';
import { SyncService } from '../../../../../services/sync.service';
import { Subject, takeUntil } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnDestroy{

  echoControl = new FormControl<string>('')
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

  sendEcho() {
    this.signalRService.sendEcho(this.echoControl.value!);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
