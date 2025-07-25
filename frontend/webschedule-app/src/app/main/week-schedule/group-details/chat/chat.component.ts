import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '../../../../../services/signal-r/message.service';
import { CommonModule } from '@angular/common';
import { SyncService } from '../../../../../services/sync.service';
import { filter, lastValueFrom, Subject, takeUntil } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MessageDto } from '../../../../../services/signal-r/dtos/message';
import { MessageRepositoryService } from '../../../../../services/message/messageRepository.service';
import { SnackBarService } from '../../../../../services/snackBarService';
import { UserRepositoryService } from '../../../../../services/user/userRepository.service';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserDto } from '../../../../../services/signal-r/dtos/user';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnDestroy{
  messages: MessageDto[] = []
  currentGroupId: number = 0;
  currentUserId: number = 0;

  echoControl = new FormControl<string>('')
  private destroy$ = new Subject<void>();

  constructor(
    public messageService: MessageService,
    private userRepository: UserRepositoryService,
    private messageRepository: MessageRepositoryService,
    private snackBarService: SnackBarService,
    syncService: SyncService
  ) {
    this.messageService.startConnection();
 
    syncService.groupId$.pipe(
      takeUntil(this.destroy$),
      filter(groupId => groupId != null)
    )
    .subscribe({
      next: async (groupId) => {
        this.messages = [];
        if (this.currentGroupId){
          this.messageService.leaveGroup(this.currentGroupId);
        }
        await this.messageService.joinGroup(groupId);
        
        this.userRepository.getLoggedIn$().subscribe({
          next: (userResponse) => {
            this.currentUserId = userResponse.id;
            messageRepository.getByGroup$(groupId).subscribe({
              next: (messagesDto) => {
                this.messages = this.combineMessages(messagesDto).reverse();
                this.currentGroupId = groupId;
              },
              error: (err) => {
                this.snackBarService.openError(err);
              }
            })
          }, error: (err) => {
            this.snackBarService.openError(err);
          }
        })
      }
    })

    this.messageService.message$.pipe(
      takeUntil(this.destroy$),
      filter(message => message != null)
    ).subscribe({
      next: message => {
        if (this.currentGroupId){
          if(this.messages[0].user.id == message.user.id) {
            this.messages[0].content = this.messages[0].content + "<br>" + message.content
          } else {
            this.messages.unshift(message);
          }
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

  private combineMessages(messages: MessageDto[]): MessageDto[]{
    const result: MessageDto[] = []
    if (messages.length === 0){
      return [];
    }
    
    let currentContentCombine = messages[0].content;
    let currentUser = {
      displayName: messages[0].user.displayName,
      id: messages[0].user.id,
      role: messages[0].user.role
    } as UserDto;
    let currentDate = messages[0].createdAt;

    for (let i = 1; i < messages.length; i++) {
      const message = messages[i];

      if (currentUser.id === message.user.id) {
        currentContentCombine = currentContentCombine + "<br>" + message.content
      } else {
        result.push({
          content: currentContentCombine,
          createdAt: currentDate,
          groupId: message.groupId,
          user: {
            displayName: currentUser.displayName,
            id: currentUser.id,
            role: currentUser.role
          }
        });
        currentContentCombine = message.content;
        currentUser = {
          displayName: message.user.displayName,
          id: message.user.id,
          role: message.user.role
        } as UserDto;
        currentDate = message.createdAt;
      }
    }
    result.push({
      content: currentContentCombine,
      createdAt: currentDate,
      groupId: this.currentGroupId,
      user: {
        displayName: currentUser.displayName,
        id: currentUser.id,
        role: currentUser.role
      }
    });
    return result;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
