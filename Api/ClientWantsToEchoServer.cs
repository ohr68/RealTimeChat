using System.Text.Json;
using Fleck;
using WebSocketBoilerplate;

namespace Api;

public class ClientWantsToEchoServerDto : BaseDto
{
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

        var messageToClient = JsonSerializer.Serialize(echo, new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
        
        socket.Send(messageToClient);
        
        return Task.CompletedTask;
    }
}

public class ServerEchosClient
{
    public string EchoValue { get; set; }
}