# API Documentation

## Overview

The Hackathon Game Platform provides multiple APIs for different types of interactions:
- **REST API**: HTTP-based API for game management and data operations
- **WebSocket API**: Real-time communication for live game updates
- **Game API**: Java/Python interfaces for bot development
- **Admin API**: Administrative operations for event management

## REST API

### Base URL
- **Development**: `http://localhost:8080/api`
- **Production**: `https://{server-domain}/api`

### Authentication
Most endpoints require authentication via session cookies or API tokens.

### Common Response Format
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Game Management Endpoints

#### GET /api/games
Retrieve list of games.

**Parameters**:
- `status` (optional): Filter by game status (`pending`, `running`, `completed`)
- `limit` (optional): Maximum number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response**:
```json
{
  "success": true,
  "data": {
    "games": [
      {
        "id": "game-123",
        "name": "Tournament Final",
        "status": "running",
        "createdAt": "2024-01-01T10:00:00Z",
        "startedAt": "2024-01-01T10:05:00Z",
        "participants": 4,
        "currentTurn": 15,
        "maxTurns": 100
      }
    ],
    "total": 1,
    "hasMore": false
  }
}
```

#### POST /api/games
Create a new game.

**Request Body**:
```json
{
  "name": "My Game",
  "maxPlayers": 4,
  "maxTurns": 100,
  "mapSize": 50,
  "settings": {
    "spawnDelay": 8,
    "visibilityRange": 5,
    "combatRange": 2
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "gameId": "game-456",
    "status": "pending",
    "joinUrl": "/games/game-456/join"
  }
}
```

#### GET /api/games/{gameId}
Get detailed information about a specific game.

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "game-123",
    "name": "Tournament Final",
    "status": "running",
    "map": {
      "width": 50,
      "height": 50,
      "outOfBounds": [[0,0], [0,1], ...],
      "collectables": [[10,15], [25,30], ...]
    },
    "players": [
      {
        "botId": "bot-1",
        "teamName": "Team Alpha",
        "playersAlive": 3,
        "spawnPoint": [5, 5],
        "score": 150
      }
    ],
    "currentTurn": 15,
    "gameState": { ... }
  }
}
```

#### POST /api/games/{gameId}/start
Start a pending game.

**Response**:
```json
{
  "success": true,
  "data": {
    "gameId": "game-123",
    "status": "running",
    "startedAt": "2024-01-01T10:05:00Z"
  }
}
```

#### POST /api/games/{gameId}/stop
Stop a running game.

**Response**:
```json
{
  "success": true,
  "data": {
    "gameId": "game-123",
    "status": "completed",
    "endedAt": "2024-01-01T10:45:00Z",
    "winner": "bot-1"
  }
}
```

### Bot Management Endpoints

#### GET /api/bots
Retrieve list of registered bots.

**Response**:
```json
{
  "success": true,
  "data": {
    "bots": [
      {
        "id": "bot-1",
        "name": "AlphaBot",
        "teamName": "Team Alpha",
        "language": "java",
        "status": "active",
        "registeredAt": "2024-01-01T09:00:00Z",
        "gamesPlayed": 5,
        "wins": 2
      }
    ]
  }
}
```

#### POST /api/bots
Register a new bot.

**Request Body**:
```json
{
  "name": "MyBot",
  "teamName": "Team Beta",
  "language": "python",
  "endpoint": "https://contestant-env.example.com/bot"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "botId": "bot-789",
    "status": "registered",
    "apiKey": "bot-api-key-xyz"
  }
}
```

#### PUT /api/bots/{botId}
Update bot configuration.

**Request Body**:
```json
{
  "name": "UpdatedBotName",
  "status": "active"
}
```

#### DELETE /api/bots/{botId}
Unregister a bot.

**Response**:
```json
{
  "success": true,
  "data": {
    "botId": "bot-789",
    "status": "deleted"
  }
}
```

### Tournament Management Endpoints

#### GET /api/tournaments
List tournaments.

#### POST /api/tournaments
Create a new tournament.

#### GET /api/tournaments/{tournamentId}
Get tournament details.

#### POST /api/tournaments/{tournamentId}/start
Start a tournament.

## WebSocket API

### Connection
Connect to WebSocket endpoint: `ws://localhost:8080/ws`

### Message Format
All WebSocket messages follow this format:
```json
{
  "type": "message_type",
  "gameId": "game-123",
  "data": { ... },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Message Types

#### Game State Updates
**Type**: `gameStateUpdate`

**Data**:
```json
{
  "gameId": "game-123",
  "turn": 15,
  "phase": "execution",
  "players": [
    {
      "botId": "bot-1",
      "positions": [[10,15], [12,18], [8,20]],
      "alive": 3
    }
  ],
  "collectables": [[25,30], [35,40]],
  "events": [
    {
      "type": "player_moved",
      "playerId": "player-1",
      "from": [10,14],
      "to": [10,15]
    },
    {
      "type": "collectable_collected",
      "playerId": "player-2",
      "position": [20,25]
    }
  ]
}
```

#### Game Events
**Type**: `gameEvent`

**Event Types**:
- `game_started`
- `game_ended`
- `player_died`
- `bot_disqualified`
- `turn_completed`

#### Error Messages
**Type**: `error`

**Data**:
```json
{
  "code": "INVALID_MOVE",
  "message": "Bot attempted to move non-existent player",
  "botId": "bot-1"
}
```

### Subscription Management
```json
{
  "type": "subscribe",
  "gameId": "game-123"
}
```

```json
{
  "type": "unsubscribe",
  "gameId": "game-123"
}
```

## Game API (Bot Development)

### Java API

#### Bot Interface
```java
public abstract class Bot {
    protected Bot(String displayName) { ... }
    
    public void initialise(GameState initialGameState) { ... }
    
    public abstract List<Move> makeMoves(GameState gameState);
}
```

#### GameState Interface
```java
public interface GameState {
    Collection<Player> getMyPlayers();
    Collection<Player> getEnemyPlayers();
    Collection<SpawnPoint> getMySpawnPoints();
    Collection<SpawnPoint> getEnemySpawnPoints();
    Collection<Collectable> getCollectables();
    Collection<Position> getOutOfBoundsPositions();
    int getMapWidth();
    int getMapHeight();
    int getCurrentTurn();
}
```

#### Move Interface
```java
public interface Move {
    Player getPlayer();
    Direction getDirection();
}

public enum Direction {
    NORTH, NORTHEAST, EAST, SOUTHEAST,
    SOUTH, SOUTHWEST, WEST, NORTHWEST
}
```

#### Example Bot Implementation
```java
public class MyBot extends Bot {
    public MyBot() {
        super("MyBot");
    }
    
    @Override
    public List<Move> makeMoves(GameState gameState) {
        List<Move> moves = new ArrayList<>();
        
        for (Player player : gameState.getMyPlayers()) {
            // Find nearest collectable
            Collectable nearest = findNearestCollectable(player, gameState);
            if (nearest != null) {
                Direction direction = getDirectionTo(player.getPosition(), nearest.getPosition());
                moves.add(new MoveImpl(player, direction));
            }
        }
        
        return moves;
    }
    
    private Collectable findNearestCollectable(Player player, GameState gameState) {
        // Implementation details...
    }
    
    private Direction getDirectionTo(Position from, Position to) {
        // Implementation details...
    }
}
```

### Python API

#### Bot Base Class
```python
from abc import ABC, abstractmethod
from typing import List

class Bot(ABC):
    def __init__(self, display_name: str):
        self.display_name = display_name
    
    def initialise(self, initial_game_state: 'GameState') -> None:
        """Override to perform initial setup"""
        pass
    
    @abstractmethod
    def make_moves(self, game_state: 'GameState') -> List['Move']:
        """Return list of moves for this turn"""
        pass
```

#### GameState Interface
```python
class GameState:
    def get_my_players(self) -> List['Player']:
        """Get all players belonging to this bot"""
        pass
    
    def get_enemy_players(self) -> List['Player']:
        """Get all visible enemy players"""
        pass
    
    def get_collectables(self) -> List['Collectable']:
        """Get all visible collectables"""
        pass
    
    def get_out_of_bounds_positions(self) -> List['Position']:
        """Get all out-of-bounds positions"""
        pass
    
    @property
    def map_width(self) -> int:
        pass
    
    @property
    def map_height(self) -> int:
        pass
    
    @property
    def current_turn(self) -> int:
        pass
```

#### Example Bot Implementation
```python
from enum import Enum

class Direction(Enum):
    NORTH = "NORTH"
    NORTHEAST = "NORTHEAST"
    EAST = "EAST"
    SOUTHEAST = "SOUTHEAST"
    SOUTH = "SOUTH"
    SOUTHWEST = "SOUTHWEST"
    WEST = "WEST"
    NORTHWEST = "NORTHWEST"

class MyBot(Bot):
    def __init__(self):
        super().__init__("MyBot")
    
    def make_moves(self, game_state: GameState) -> List[Move]:
        moves = []
        
        for player in game_state.get_my_players():
            # Find nearest collectable
            nearest = self.find_nearest_collectable(player, game_state)
            if nearest:
                direction = self.get_direction_to(player.position, nearest.position)
                moves.append(Move(player, direction))
        
        return moves
    
    def find_nearest_collectable(self, player, game_state):
        # Implementation details...
        pass
    
    def get_direction_to(self, from_pos, to_pos):
        # Implementation details...
        pass
```

## Admin API

### Authentication
Admin endpoints require authentication with username `admin` and password `secret` (configurable).

### Endpoints

#### GET /admin/dashboard
Administrative dashboard interface.

#### POST /admin/hackathons
Create a new hackathon event.

#### GET /admin/hackathons/{hackathonId}/teams
Manage teams for a hackathon.

#### POST /admin/hackathons/{hackathonId}/teams
Add a new team to a hackathon.

## Error Handling

### HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate name)
- `500 Internal Server Error`: Server error

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "INVALID_MOVE",
    "message": "Player does not exist",
    "details": {
      "playerId": "player-123",
      "botId": "bot-456"
    }
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Rate Limiting

### Bot API Calls
- Maximum 10 requests per second per bot
- Burst allowance of 50 requests
- Timeout after 30 seconds of inactivity

### WebSocket Connections
- Maximum 100 concurrent connections per IP
- Automatic disconnection after 1 hour of inactivity
- Reconnection allowed with exponential backoff

## API Versioning

### Current Version
All APIs are currently version 1.0. Future versions will be indicated in the URL path:
- `v1`: `/api/v1/games`
- `v2`: `/api/v2/games` (future)

### Backward Compatibility
- Minor version updates maintain backward compatibility
- Major version updates may introduce breaking changes
- Deprecated endpoints will be supported for at least 6 months