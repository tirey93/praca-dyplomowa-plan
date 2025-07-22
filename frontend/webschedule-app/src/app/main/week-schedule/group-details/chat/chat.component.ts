import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '../../../../../services/signal-r/message.service';
import { CommonModule } from '@angular/common';
import { SyncService } from '../../../../../services/sync.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MessageDto } from '../../../../../services/signal-r/dtos/message';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnDestroy{
  messages: MessageDto[] = []

  echoControl = new FormControl<string>('')
  private destroy$ = new Subject<void>();

  constructor(
    public messageService: MessageService,
    syncService: SyncService
  ) {
    this.messageService.startConnection();
    syncService.groupSelected$.pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (selected) => {
        if (selected) {
          this.messageService.unsubscribe();
          this.messageService.receiveListener();
        } else {
          this.messageService.unsubscribe();
        }
      }
    })

    this.messageService.message$.pipe(
      takeUntil(this.destroy$),
      filter(message => message != null)
    )
    .subscribe({
      next: message => {
        console.log('message in');
        this.messages.push(message);
      }
    })
  }

  sendEcho() {
    this.messageService.sendMessage({message: this.echoControl.value!, prop: 2});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
