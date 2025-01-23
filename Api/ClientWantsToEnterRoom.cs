using System.Text.Json;
using System.Text.Json.Serialization;
using Api.Services;
using Fleck;
using WebSocketBoilerplate;

namespace Api;

public class ClientWantsToEnterRoomDto : BaseDto
{
    [JsonPropertyName("roomId")]
    public int RoomId { get; set; }
}

public class ClientWantsToEnterRoom : BaseEventHandler<ClientWantsToEnterRoomDto>
{
    public override Task Handle(ClientWantsToEnterRoomDto dto, IWebSocketConnection socket)
    {
        var joined = StateService.AddToRoom(socket, dto.RoomId);

        var message = joined ? $"You were added to room with ID {dto.RoomId}!" : $"Cannot add to room with ID {dto.RoomId}!";
        
            socket.Send(JsonSerializer.Serialize(new ServerAddsClientToRoom()
            {
                Message = message
            }));

        return Task.CompletedTask;
    }
}

public class ServerAddsClientToRoom : BaseDto
{
    public string Message { get; set; }
}