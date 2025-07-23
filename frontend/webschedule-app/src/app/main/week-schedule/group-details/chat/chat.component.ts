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
import { MessageRepositoryService } from '../../../../../services/message/messageRepository.service';
import { SnackBarService } from '../../../../../services/snackBarService';

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
  currentGroupId: number = 0

  echoControl = new FormControl<string>('')
  private destroy$ = new Subject<void>();

  constructor(
    public messageService: MessageService,
    private messageRepository: MessageRepositoryService,
    private snackBarService: SnackBarService,
    syncService: SyncService
  ) {
    this.messageService.startConnection();

    syncService.groupId$.pipe(
      takeUntil(this.destroy$),
      filter(groupId=> groupId != null)
    )
    .subscribe({
      next: async (groupId) => {
        this.messages = [];
        if (this.currentGroupId){
          this.messageService.leaveGroup(this.currentGroupId);
        }
        await this.messageService.joinGroup(groupId);
        this.currentGroupId = groupId;

        messageRepository.getByGroup$(this.currentGroupId).subscribe({
          next: (messagesDto) => {
            this.messages = messagesDto
          },
          error: (err) => {
            this.snackBarService.openError(err);
          }
        })
      }
    })

    this.messageService.message$.pipe(
      takeUntil(this.destroy$),
      filter(message => message != null)
    )
    .subscribe({
      next: message => {
        if (this.currentGroupId){
          this.messages.push(message);
        }
      }
    })
  }

  send() {
    this.messageRepository.sendByLoggedIn$({content: this.echoControl.value!, groupId: this.currentGroupId}).subscribe({
      error: (err) => {
        this.snackBarService.openError(err);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
