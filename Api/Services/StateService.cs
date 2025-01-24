using System.Text.Json;
using Fleck;

namespace Api.Services;

public class WebSocketWithMetaData(IWebSocketConnection connection)
{
    public IWebSocketConnection Connection { get; set; } = connection;
    public string? Username { get; set; }
}

public static class StateService
{
    private static readonly Dictionary<Guid, WebSocketWithMetaData> Connections = new();
    private static readonly Dictionary<int, HashSet<Guid>> Rooms = new();

    public static bool AddConnection(IWebSocketConnection connection)
        => Connections.TryAdd(connection.ConnectionInfo.Id, new WebSocketWithMetaData(connection));

    public static bool AddToRoom(IWebSocketConnection connection, int room)
    {
        if (!Rooms.ContainsKey(room))
            Rooms.Add(room, new HashSet<Guid>());

        return Rooms[room].Add(connection.ConnectionInfo.Id);
    }

    public static void BroadcastToRoom(int room, ServerBroadcastsMessageWithUsername message)
    {
        if (Rooms.TryGetValue(room, out var connectionIds))
        {
            foreach (var connectionId in connectionIds)
            {
                if (Connections.TryGetValue(connectionId, out var connectionWithMetaData))
                {
                    connectionWithMetaData.Connection.Send(JsonSerializer.Serialize(message));
                }
            }
        }
    }

    public static void SignIn(IWebSocketConnection connection, ClientWantsToSignInDto clientWantsToSignInDto)
    {
        Connections[connection.ConnectionInfo.Id].Username = clientWantsToSignInDto.Username;
    }
    
    public static string GetConnectionUserName(Guid connectionId)
        => Connections[connectionId].Username!;
}