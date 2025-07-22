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
  currentGroup: number = 0

  echoControl = new FormControl<string>('')
  private destroy$ = new Subject<void>();

  constructor(
    public messageService: MessageService,
    syncService: SyncService
  ) {
    syncService.groupId$.pipe(
      takeUntil(this.destroy$),
      filter(groupId=> groupId != null)
    )
    .subscribe({
      next: (groupId) => {
        this.messages = [];
        if (this.currentGroup){
          this.messageService.leaveGroup(this.currentGroup);
        }
        this.messageService.startConnection(groupId);
        this.currentGroup = groupId;
      }
    })

    this.messageService.message$.pipe(
      takeUntil(this.destroy$),
      filter(message => message != null)
    )
    .subscribe({
      next: message => {
        this.messages.push(message);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
