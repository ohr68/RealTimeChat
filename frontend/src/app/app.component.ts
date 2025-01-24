import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {
  BaseDto, ClientWantsToBroadcastToRoomDto,
  ClientWantsToEnterRoom,
  ClientWantsToSignIn,
  ServerAddsClientToRoomDto, ServerBroadcastsMessageWithUsernameDto,
  ServerEchosClientDto
} from '../baseDto';
import {ChatComponent} from '../chat/chat.component';
import {WebSocketService} from '../services/websocket.service';
import {join} from '@angular/compiler-cli';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, ChatComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'frontend';

  messages: string[] = [];
  room?: number;
  isAuthenticated: boolean = false;

  userName: FormControl<string | null> = new FormControl('');

  constructor(private webSocketService: WebSocketService) {
  }

  ngOnInit() {
    this.webSocketService.connect();

    this.webSocketService.messages.subscribe((event) => {
      const messageFromServer = event as BaseDto<any>;

      this.isAuthenticated = true;

      this.messages.push(JSON.stringify(event.message));
    });
  }

  signIn() {
    this.webSocketService!.signIn(this.userName.value!);
  }
}
