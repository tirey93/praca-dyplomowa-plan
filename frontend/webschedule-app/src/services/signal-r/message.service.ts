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
  private connectionPromise!: Promise<void>;

  public message$ = new BehaviorSubject<MessageDto | null>(null);
  
  protected url = `${environment.host}:${environment.port}/messageHub`
  
  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.url)
      .build();

    this.connectionPromise = this.hubConnection.start()
      .then(() => this.onMessageReceive());
  }

  onMessageReceive = () => {
    this.hubConnection.on('Receive', (messageDto: MessageDto) => {
      this.message$.next(messageDto);
    });
  }

  async joinGroup(groupId: number) {
    await this.connectionPromise;
    await this.hubConnection.invoke("JoinGroup", groupId);
  }

  leaveGroup(groupId: number) {
    this.hubConnection.invoke("LeaveGroup", groupId);
  }

  ngOnDestroy(): void {
      this.hubConnection.stop();
  }
}