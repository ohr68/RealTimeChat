using System.Text.Json;
using Api.Services;
using Fleck;
using WebSocketBoilerplate;

namespace Api;

public class ClientWantsToBroadcastToRoomDto : BaseDto
{
    public string? Message { get; set; }
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
            JsonSerializer.Serialize(message, new JsonSerializerOptions() { PropertyNameCaseInsensitive = true }));
        
        return Task.CompletedTask;
    }
}

public class ServerBroadcastsMessageWithUsername : BaseDto
{
    public string? Message { get; set; }
    public string? Username { get; set; }
}