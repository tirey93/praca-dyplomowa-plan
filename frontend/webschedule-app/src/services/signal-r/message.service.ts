import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../enviroments/enviroments';
import { MessageDto } from './dtos/message';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnDestroy{
  private hubConnection!: signalR.HubConnection;
  public message$ = new BehaviorSubject<MessageDto | null>(null);
  protected url = `${environment.host}:${environment.port}/messageHub`
  

  startConnection = (groupId: number) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.url)
      .build();

    this.hubConnection.start().then(() => {
      this.joinGroup(groupId);
      this.onMessageReceive();
    });
  }

  onMessageReceive = () => {
    this.hubConnection.on('Receive', (messageDto: MessageDto) => {
      this.message$.next(messageDto);
    });
  }

  joinGroup(groupId: number) {
    this.hubConnection.invoke("JoinGroup", groupId);
  }

  sendMessage(dto: MessageDto) {
    this.hubConnection.invoke("SendMessage", dto);
  }

  leaveGroup(groupId: number) {
    this.hubConnection.invoke("LeaveGroup", groupId);
  }

  ngOnDestroy(): void {
      this.hubConnection.stop();
  }
}