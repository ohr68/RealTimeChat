import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {
  BaseDto, ClientSeenMessageDto,
  ClientWantsToBroadcastToRoomDto,
  ServerBroadcastsMessageWithUsernameDto
} from '../baseDto';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {WebSocketService} from '../services/websocket.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {RawHtmlComponent} from '../raw-html/raw-html.component';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgForOf,
    RawHtmlComponent,
    NgIf
  ],
  styleUrl: './chat.component.scss'
})

export class ChatComponent implements OnInit, OnDestroy {
  @Input() currentUser!: string;

  room = 0;
  currentRoom = 0;
  messageContent = '';
  isReceiving = false;
  messages!: string [];
  messageHistory!: ServerBroadcastsMessageWithUsernameDto[];


  constructor(private webSocketService: WebSocketService, private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit(): void {
    this.webSocketService.messages.subscribe((event) => {

      if (event.roomId == this.room) {
        const messageFromServer = event as BaseDto<any>;
        console.log(messageFromServer);

        if (messageFromServer.eventType == "ServerBroadcastsMessageWithUsername") {
          const broadcastMessage = event as ServerBroadcastsMessageWithUsernameDto;

          this.isReceiving = broadcastMessage.username !== this.currentUser;

          let html = `<div id="${broadcastMessage.id}" class="flex w-full ${this.isReceiving ? 'justify-start' : 'justify-end'} py-6">
                                <div class="chat ${this.isReceiving ? 'chat-start' : 'chat-end'}">
                                    <div class="chat-image avatar">
                                      <div class="w-10 rounded-full">
                                         <img
                                             alt="Tailwind CSS chat bubble component"
                                             src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                      </div>
                                    </div>
                                    <div class="chat-header">
                                      ${broadcastMessage.username}
                                      <time class="text-xs opacity-50">${broadcastMessage.time}</time>
                                    </div>
                                     <div class="chat-bubble">
                                        ${broadcastMessage.message}
                                    </div>
                                    <div id="${broadcastMessage.id}--status" class="chat-footer opacity-50">${broadcastMessage.read ? 'Seen' : 'Delivered'}</div>
                                </div>
                            </div>`

          this.messages.push(html);
          this.messageHistory.push(broadcastMessage);
        }

        if(messageFromServer.eventType == "ServerMarkedAsSeenMessages") {
          const container = this.renderer.selectRootElement('#0e960311-6a95-47d7-b713-0dc9ae1d0646', true);

          console.log(container);

          // for (const seenMessage of this.messageHistory) {
          //   @ViewChild(`${seenMessage.id}--status`) messageDiv!: ElementRef;
          //
          //   messageDiv.
          // }
        }
      }
    });
  }

  joinRoom(): void {
    if (this.room) {
      this.webSocketService.joinRoom(this.room);
      this.currentRoom = this.room;
      this.messages = [];
      this.messageHistory = [];
    }
  }

  leaveRoom(): void {
    this.webSocketService.leaveRoom();
    this.currentRoom = 0;
    this.messages = [];
  }

  markAsSeen(): void {
    if (this.isReceiving) {
      const seenEvent = new ClientSeenMessageDto(Number(this.currentRoom), this.messageHistory);

      this.webSocketService.sendMessage(seenEvent);
    }
  }

  sendMessage(): void {
    this.webSocketService.sendMessage(new ClientWantsToBroadcastToRoomDto(Number(this.currentRoom), this.messageContent!));

    this.messageContent = '';
  }

  ngOnDestroy(): void {
    this.webSocketService.close();
  }

  protected readonly JSON = JSON;
}
