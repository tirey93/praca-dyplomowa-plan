import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class SignalRService implements OnDestroy{
  private hubConnection!: signalR.HubConnection;
  public notifications: string[] = [];
  protected url = `${environment.host}:${environment.port}/testHub`
  

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.url)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Połączenie nawiązane'))
      .catch(err => console.log('Błąd podczas nawiązywania połączenia: ' + err));
  }

  public addNotificationListener = () => {
    this.hubConnection.on('Echo', (message: string) => {
      this.notifications.push(message);
      console.log('Otrzymano powiadomienie: ', message);
    });
  }

  sendEcho(message: string) {
    this.hubConnection.invoke("SendEcho", message);
  }

  public unsubscribe() {
    this.hubConnection.off('Echo')
  }

  ngOnDestroy(): void {
      this.hubConnection.stop();
  }
}