using System.Text.Json;
using System.Text.Json.Serialization;
using Fleck;
using WebSocketBoilerplate;

namespace Api;

public class ClientWantsToEchoServerDto : BaseDto
{
    [JsonPropertyName("messageContent")]
    public string MessageContent { get; set; }
}

public class ClientWantsToEchoServer : BaseEventHandler<ClientWantsToEchoServerDto>
{
    public override Task Handle(ClientWantsToEchoServerDto dto, IWebSocketConnection socket)
    {
        var echo = new ServerEchosClient()
        {
            EchoValue = "echo: " + dto.MessageContent
        };

        var messageToClient = JsonSerializer.Serialize(echo);
        
        socket.Send(messageToClient);
        
        return Task.CompletedTask;
    }
}

public class ServerEchosClient : BaseDto
{
    public string EchoValue { get; set; }
}