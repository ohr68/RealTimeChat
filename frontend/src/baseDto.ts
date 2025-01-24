export class BaseDto<T> {
  eventType: string;

  constructor(init?: Partial<any>) {
    this.eventType = this.constructor.name;
    Object.assign(this, init);
  }
}

export class ServerEchosClientDto extends BaseDto<ServerEchosClientDto> {
  echoValue?: string;
}

export class ServerAddsClientToRoomDto extends BaseDto<ServerAddsClientToRoomDto> {
  message?: string;
}

export class ServerBroadcastsMessageWithUsernameDto extends BaseDto<ServerBroadcastsMessageWithUsernameDto> {
  id?: string;
  message?: string;
  username?: string;
  roomId?: number;
  time?: string;
  read?: boolean;
}

export class ClientWantsToSignIn extends BaseDto<ClientWantsToSignIn> {
  userName?: string;

  constructor(userName: string) {
    super();
    this.userName = userName;
  }
}

export class ClientWantsToEnterRoom extends BaseDto<ClientWantsToEnterRoom> {
  roomId: number;

  constructor(roomId: number) {
    super();
    this.roomId = roomId;
  }
}

export class ClientWantsToBroadcastToRoomDto extends BaseDto<ClientWantsToBroadcastToRoomDto> {
  roomId: number;
  message?: string;

  constructor(roomId: number, message?: string) {
    super();
    this.roomId = roomId;
    this.message = message;
  }
}

export class ClientSeenMessageDto extends BaseDto<ClientSeenMessageDto> {
  roomId!: number;
  messages: ServerBroadcastsMessageWithUsernameDto[];

  constructor(roomId: number, messages: ServerBroadcastsMessageWithUsernameDto[] ) {
    super();
    this.roomId = roomId;
    this.messages = messages;
  }
}
