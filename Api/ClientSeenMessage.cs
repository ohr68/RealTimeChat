using System.Text.Json;
using System.Text.Json.Serialization;
using Fleck;
using WebSocketBoilerplate;

namespace Api;

public class ClientSeenMessageDto : BaseDto
{
    [JsonPropertyName("roomId")]
    public int RoomId { get; set; }
    
    [JsonPropertyName("messages")]
    public ServerBroadcastsMessageWithUsername[]? Messages { get; set; }
}

public class ClientSeenMessage : BaseEventHandler<ClientSeenMessageDto>
{
    public override Task Handle(ClientSeenMessageDto dto, IWebSocketConnection socket)
    {
        var seenMessageDto = new ServerMarkedAsSeenMessages(dto.RoomId);
        
        List<ServerMarkedAsSeenMessage> seenMessages = new();
        foreach (var message in dto.Messages!)
        {
            seenMessages.Add(new ServerMarkedAsSeenMessage()
            {
                Id = message.Id,
                Message = message.Message,
                Username = message.Username,
                RoomId = message.RoomId,
                Time = message.Time,
                Read = true,
                SeenAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
            });
        }
        
        seenMessageDto.SeenMessages = seenMessages.ToArray();
        socket.Send(JsonSerializer.Serialize(seenMessageDto));
        
        return Task.CompletedTask;
    }
}

public class ServerMarkedAsSeenMessages(int roomId) : BaseDto
{
    [JsonPropertyName("roomId")] 
    public int RoomId { get; set; } = roomId;

    [JsonPropertyName("seenMessages")]
    public IEnumerable<ServerMarkedAsSeenMessage>? SeenMessages { get; set; }
}

public class ServerMarkedAsSeenMessage 
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
    
    [JsonPropertyName("seenAt")]
    public string? SeenAt { get; set; }
}