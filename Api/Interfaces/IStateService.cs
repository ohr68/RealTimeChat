using Fleck;

namespace Api.Interfaces;

public interface IStateService
{
    IDictionary<Guid, IWebSocketConnection> Connections { get; set; }
    IDictionary<int, HashSet<Guid>> Rooms { get; set; }

    bool AddConnection(IWebSocketConnection connection);
    bool AddToRoom(IWebSocketConnection connection, int room);
    void BroadcastToRoom(int room, string message);
}