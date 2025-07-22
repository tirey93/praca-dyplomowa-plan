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
  

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.url)
      .build();

    this.hubConnection.start();
  }

  public receiveListener = () => {
    this.hubConnection.on('Receive', (messageDto: MessageDto) => {
      this.message$.next(messageDto);
    });
  }

  sendMessage(dto: MessageDto) {
    this.hubConnection.invoke("SendMessage", dto);
  }

  unsubscribe() {
    this.hubConnection.off('Receive')
  }

  ngOnDestroy(): void {
      this.hubConnection.stop();
  }
}