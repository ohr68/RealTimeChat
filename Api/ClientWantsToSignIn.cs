using System.Text.Json;
using System.Text.Json.Serialization;
using Api.Services;
using Fleck;
using WebSocketBoilerplate;

namespace Api;

public class ClientWantsToSignInDto : BaseDto
{
    [JsonPropertyName("username")]
    public string? Username { get; set; }
}

public class ClientWantsToSignIn : BaseEventHandler<ClientWantsToSignInDto>
{
    public override Task Handle(ClientWantsToSignInDto dto, IWebSocketConnection socket)
    {
        StateService.SignIn(socket, dto);

        var echo = new ServerEchosClient()
        {
            EchoValue = $"Welcome {dto.Username}"
        };

        socket.Send(JsonSerializer.Serialize(echo));
            
        return Task.CompletedTask;
    }
}