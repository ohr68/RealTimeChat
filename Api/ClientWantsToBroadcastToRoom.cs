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
            Id = Guid.NewGuid(),
            Message = dto.Message,
            Username = StateService.GetConnectionUserName(socket.ConnectionInfo.Id),
            RoomId = dto.RoomId,
            Time = DateTime.Now.ToString("HH:mm"),
            Read = false
        };

        StateService.BroadcastToRoom(dto.RoomId, message);
        
        return Task.CompletedTask;
    }
}

public class ServerBroadcastsMessageWithUsername : BaseDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("message")]
    public string? Message { get; set; }
    
    [JsonPropertyName("username")]
    public string? Username { get; set; }

    [JsonPropertyName("roomId")]
    public int RoomId { get; set; }
    
    [JsonPropertyName("time")]
    public string? Time { get; set; }

    [JsonPropertyName("read")] 
    public bool Read { get; set; }
}