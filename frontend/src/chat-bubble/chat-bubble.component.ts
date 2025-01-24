import {Component, Input} from "@angular/core";
import {ServerBroadcastsMessageWithUsernameDto} from '../baseDto';

@Component({
  selector: "chat-bubble",
  templateUrl: "./chat-bubble.component.html",
  styleUrls: ["./chat-bubble.component.css"]
})

export class ChatBubbleComponent {
    @Input() broadcastMessage!: ServerBroadcastsMessageWithUsernameDto;
}
