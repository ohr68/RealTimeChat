import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {BaseDto, ServerEchosClientDto} from '../baseDto';

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

  sendMessage() {
    let obj = {
      eventType: "ClientWantsToEchoServer",
      messageContent: this.messageContent.value!
    }

    this.ws.send(JSON.stringify(obj));
  }
}
