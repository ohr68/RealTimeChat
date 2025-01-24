import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {
  BaseDto, ClientWantsToBroadcastToRoomDto,
  ClientWantsToEnterRoom,
  ClientWantsToSignIn,
  ServerAddsClientToRoomDto, ServerBroadcastsMessageWithUsernameDto,
  ServerEchosClientDto
} from '../baseDto';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';

  messages: string[] = [];

  ws: WebSocket = new WebSocket("ws://localhost:8181/");
  messageContent: FormControl<string | null> = new FormControl('');
  userName: FormControl<string | null> = new FormControl('');
  roomId: FormControl<number | null> = new FormControl(0);
  message: FormControl<string | null> = new FormControl('');

  constructor() {
    this.ws.onmessage = message => {
      const messageFromServer = JSON.parse(message.data) as BaseDto<any>;

      // @ts-ignore
      this[messageFromServer.eventType].call(this, messageFromServer);
    }
  }

  ServerEchosClient(dto: ServerEchosClientDto) {
    this.messages.push(dto.echoValue!);
  }

  ServerAddsClientToRoom(dto: ServerAddsClientToRoomDto) {
    this.messages.push(dto.message!);
  }

  ServerBroadcastsMessageWithUsername(dto: ServerBroadcastsMessageWithUsernameDto) {
    this.messages.push(dto.message!);
  }

  sendEcho() {
    let obj = {
      eventType: "ClientWantsToEchoServer",
      messageContent: this.messageContent.value!
    }

    this.ws.send(JSON.stringify(obj));
  }

  signIn() {
    let signIn = new ClientWantsToSignIn(this.userName.value!);

    this.ws.send(JSON.stringify(signIn));
  }

  enterRoom() {
    let roomId = new ClientWantsToEnterRoom(Number(this.roomId.value!));

    this.ws.send(JSON.stringify(roomId));
  }

  sendMessage() {
    let message = new ClientWantsToBroadcastToRoomDto(Number(this.roomId.value!), this.message.value!);

    this.ws.send(JSON.stringify(message));
  }

  protected readonly JSON = JSON;
}
