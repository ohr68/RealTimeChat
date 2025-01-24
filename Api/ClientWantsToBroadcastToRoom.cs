using System.Text.Json;
using System.Text.Json.Serialization;
using Api.Services;
using Fleck;
using WebSocketBoilerplate;

namespace Api;

public class ClientWantsToBroadcastToRoomDto : BaseDto
{
    [JsonPropertyName("message")]
    public string? Message { get; set; }
    
    [JsonPropertyName("roomId")]
    public int RoomId { get; set; }
}

public class ClientWantsToBroadcastToRoom : BaseEventHandler<ClientWantsToBroadcastToRoomDto>
{
    public override Task Handle(ClientWantsToBroadcastToRoomDto dto, IWebSocketConnection socket)
    {
        var message = new ServerBroadcastsMessageWithUsername()
        {
            Message = dto.Message,
            Username = StateService.GetConnectionUserName(socket.ConnectionInfo.Id)
        };

        StateService.BroadcastToRoom(dto.RoomId,
            JsonSerializer.Serialize(message));
        
        return Task.CompletedTask;
    }
}

public class ServerBroadcastsMessageWithUsername : BaseDto
{
    [JsonPropertyName("message")]
    public string? Message { get; set; }
    
    [JsonPropertyName("username")]
    public string? Username { get; set; }
}