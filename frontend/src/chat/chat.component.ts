import {Component, Input} from '@angular/core';
import {ChatBubbleComponent} from '../chat-bubble/chat-bubble.component';
import {BaseDto, ClientWantsToBroadcastToRoomDto, ServerBroadcastsMessageWithUsernameDto} from '../baseDto';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  imports: [
    ChatBubbleComponent,
    ReactiveFormsModule
  ],
  styleUrl: './chat.component.scss'
})

export class ChatComponent {
  @Input() connection!: WebSocket;
  @Input() roomId!: number;
  @Input() messages!: string [];

  message: FormControl<string | null> = new FormControl('');

  sendMessage() {
    let message = new ClientWantsToBroadcastToRoomDto(Number(this.roomId!), this.message.value!);

    this.connection.send(JSON.stringify(message));
  }

  protected readonly JSON = JSON;
}
