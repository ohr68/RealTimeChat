import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {
  BaseDto,
  ClientWantsToEnterRoom,
  ClientWantsToSignIn,
  ServerAddsClientToRoomDto, ServerBroadcastsMessageWithUsernameDto,
  ServerEchosClientDto
} from '../baseDto';
import {ChatComponent} from '../chat/chat.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  title = 'frontend';

  messages: string[] = [];

  ws?: WebSocket;
  room?: number;

  messageContent: FormControl<string | null> = new FormControl('');
  userName: FormControl<string | null> = new FormControl('');
  roomId: FormControl<number | null> = new FormControl(0);

  ngOnInit() {
    this.ws = new WebSocket("ws://localhost:8181/");

    this.ws!.onmessage = message => {
      const messageFromServer = JSON.parse(message.data) as BaseDto<any>;

      // @ts-ignore
      this[messageFromServer.eventType].call(this, messageFromServer);
    }
  }

  ServerBroadcastsMessageWithUsername(dto: ServerBroadcastsMessageWithUsernameDto) {
    this.messages.push(dto.message!);
  }

  ServerEchosClient(dto: ServerEchosClientDto) {
    this.messages.push(dto.echoValue!);
  }

  ServerAddsClientToRoom(dto: ServerAddsClientToRoomDto) {
    this.messages.push(dto.message!);
  }

  sendEcho() {
    let obj = {
      eventType: "ClientWantsToEchoServer",
      messageContent: this.messageContent.value!
    }

    this.ws!.send(JSON.stringify(obj));
  }

  signIn() {
    let signIn = new ClientWantsToSignIn(this.userName.value!);

    this.ws!.send(JSON.stringify(signIn));
  }

  enterRoom() {
    let roomData = new ClientWantsToEnterRoom(Number(this.roomId.value!));

    this.ws!.send(JSON.stringify(roomData));

    this.room = roomData.roomId
  }

  protected readonly JSON = JSON;
}
