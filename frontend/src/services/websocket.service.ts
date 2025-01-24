import {Injectable} from "@angular/core";
import {Observable, Subject} from 'rxjs';
import {BaseDto, ClientWantsToEnterRoom, ClientWantsToSignIn} from '../baseDto';

@Injectable({
  providedIn: 'root',
})

export class WebSocketService {
  private socket!: WebSocket;
  private messages$: Subject<any> = new Subject<any>();
  private currentRoom!: number;

  connect(url: string = "ws://localhost:8181/"): void {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      this.socket = new WebSocket(url);

      this.socket.onmessage = (message) => {
        this.messages$.next(JSON.parse(message.data));
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      this.socket.onclose = (event) => {
        console.error('WebSocket connection closed:', event);
      };
    }
  }

  joinRoom(roomId: number): void {
    if (this.currentRoom)
      this.leaveRoom();

    this.currentRoom = roomId;
    let joinRoomRequest = new ClientWantsToEnterRoom(Number(this.currentRoom));
    this.sendMessage(joinRoomRequest);
  }

  leaveRoom(): void {
    if (this.currentRoom) {
      this.sendMessage(this.currentRoom);
      this.currentRoom = 0;
    }
  }

  signIn(username: string): void {
    let signInRequest = new ClientWantsToSignIn(username);

    this.sendMessage(signInRequest);
  }

  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState == WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  }

  close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  get messages(): Observable<any> {
    return this.messages$.asObservable();
  }
}
