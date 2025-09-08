# Game Design Documentation

## Overview

The Hackathon Game is a turn-based strategy game where teams develop AI bots to compete on a 2D grid-based map. The objective is to be the last team with living players by collecting food, managing resources, and engaging in tactical combat.

## Core Game Mechanics

### Game World

#### Map Structure
- **Grid-based**: 2D rectangular grid with configurable dimensions
- **Topology**: Donut-shaped (toroidal) - edges wrap around
- **Distance Calculation**: All 8 adjacent squares are equidistant (no diagonal penalty)
- **Coordinate System**: (x, y) where (0, 0) is top-left corner

#### Terrain Types
- **Normal Terrain**: Standard playable area
- **Out of Bounds**: Water/impassable areas that kill players who enter
- **Spawn Points**: Team starting locations where new players appear

### Game Entities

#### Players
- **Representation**: Individual units controlled by bot strategies
- **Lifecycle**: Spawned at team spawn points, can die from various causes
- **Visibility**: Limited to 5-move radius (11×11 square) around each player
- **Movement**: Can move to any of 8 adjacent squares per turn

#### Collectables (Food)
- **Purpose**: Collecting food spawns new players for the team
- **Generation**: Randomly placed each turn across the map
- **Collection**: Automatic when player moves to same position
- **Effect**: New player spawns at team's spawn point next turn (if spawn point exists)

#### Spawn Points
- **Function**: Team base where new players are created
- **Vulnerability**: Can be destroyed by enemy players moving onto them
- **Protection**: Critical strategic asset requiring defense
- **Respawn**: Once destroyed, team cannot create new players

### Turn Structure

#### Game Phases
1. **Bot Decision Phase**: Each bot's `makeMoves()` method is called
2. **Move Validation Phase**: Server validates all submitted moves
3. **Move Execution Phase**: Valid moves are processed simultaneously
4. **Combat Resolution Phase**: Handle collisions and combat
5. **Collection Phase**: Process food collection and spawning
6. **State Update Phase**: Update game state and broadcast to clients

#### Turn Timing
- **Bot Timeout**: Limited time for bots to return moves (configurable)
- **Simultaneous Execution**: All valid moves happen at the same time
- **Turn Counter**: Game tracks current turn number

### Combat System

#### Collision Rules
- **Direct Collision**: Two players moving to the same position both die
- **Swap Collision**: Two players swapping positions both die
- **Chain Collisions**: Multiple players involved in collision all die

#### Outnumbering Mechanic
- **Range**: Players within 2 moves of each other engage in combat
- **Calculation**: Count friendly vs enemy players in combat range
- **Resolution**: Outnumbered players die at end of turn
- **Ties**: Equal numbers result in no deaths from outnumbering

#### Combat Examples
```
Scenario 1: Direct Collision
Turn N:   A1 -> [X] <- B1
Turn N+1: [X] (both A1 and B1 die)

Scenario 2: Outnumbering (2v1)
A1  A2
   B1
Result: B1 dies (outnumbered 2 to 1)

Scenario 3: Complex Combat
A1  A2     B1
A3     vs  B2  B3
Result: A1, A2, A3 survive (3v2 advantage)
```

### Victory Conditions

#### Primary Victory
- **Last Team Standing**: Be the only team with living players
- **Elimination**: All other teams have zero players remaining

#### Secondary Conditions
- **Turn Limit**: If maximum turns reached, team with most players wins
- **Tie Breaking**: In case of equal players, use total score/food collected
- **Disqualification**: Teams can be eliminated for rule violations

### Player Spawning

#### Spawn Mechanics
- **Initial Spawn**: First 8 turns, one player spawns per team per turn
- **Food-based Spawn**: After turn 8, only food collection creates new players
- **Spawn Location**: Always at team's spawn point (if it exists)
- **Spawn Timing**: New players appear at start of turn after food collection

#### Spawn Limitations
- **Spawn Point Required**: Cannot spawn if spawn point is destroyed
- **One Per Turn**: Maximum one new player per team per turn
- **Queue System**: Multiple food collections queue up for future turns

## Bot Development Interface

### Bot Class Structure

#### Abstract Bot Class
```java
public abstract class Bot {
    protected Bot(String displayName);
    
    public void initialise(GameState initialGameState);
    public abstract List<Move> makeMoves(GameState gameState);
}
```

#### Key Responsibilities
- **Strategy Implementation**: Define how players should move and behave
- **State Analysis**: Process limited game state information
- **Move Generation**: Return valid moves for all controlled players
- **Error Handling**: Handle edge cases and invalid states gracefully

### Game State Interface

#### Visible Information
```java
public interface GameState {
    // Own team information
    Collection<Player> getMyPlayers();
    Collection<SpawnPoint> getMySpawnPoints();
    
    // Enemy information (within visibility range)
    Collection<Player> getEnemyPlayers();
    Collection<SpawnPoint> getEnemySpawnPoints();
    
    // World information
    Collection<Collectable> getCollectables();
    Collection<Position> getOutOfBoundsPositions();
    
    // Game metadata
    int getMapWidth();
    int getMapHeight();
    int getCurrentTurn();
}
```

#### Visibility Rules
- **Range Limitation**: Only see entities within 5 moves of own players
- **Fog of War**: Areas without nearby players are not visible
- **Memory**: No persistent memory of previously seen areas
- **Real-time**: State reflects current turn only

### Move Interface

#### Move Definition
```java
public interface Move {
    Player getPlayer();    // Which player to move
    Direction getDirection(); // Which direction to move
}

public enum Direction {
    NORTH, NORTHEAST, EAST, SOUTHEAST,
    SOUTH, SOUTHWEST, WEST, NORTHWEST
}
```

#### Move Validation
- **Player Ownership**: Can only move own players
- **Player Existence**: Player must be alive and exist
- **Unique Moves**: Cannot move same player multiple times
- **Valid Direction**: Direction must be one of 8 compass directions

### Strategy Patterns

#### Common Bot Strategies

##### Aggressive Strategy
- Focus on destroying enemy spawn points
- Prioritize combat over food collection
- Group players for outnumbering advantages
- Risk-taking behavior for high rewards

##### Defensive Strategy
- Protect own spawn point at all costs
- Avoid combat when possible
- Focus on food collection and growth
- Conservative positioning

##### Balanced Strategy
- Mix of offense and defense
- Opportunistic combat engagement
- Efficient food collection
- Adaptive based on game state

##### Swarm Strategy
- Create many small groups
- Overwhelm enemies with numbers
- Distributed food collection
- Resilient to losses

#### Advanced Techniques

##### Pathfinding
```java
public class PathfindingBot extends Bot {
    public Direction findPathTo(Position from, Position to, GameState state) {
        // A* or Dijkstra implementation
        // Consider obstacles and enemy positions
        // Return next direction in optimal path
    }
}
```

##### Prediction
```java
public class PredictiveBot extends Bot {
    public List<Position> predictEnemyMoves(GameState state) {
        // Analyze enemy movement patterns
        // Predict likely next positions
        // Plan counter-strategies
    }
}
```

##### Coordination
```java
public class CoordinatedBot extends Bot {
    public List<Move> coordinateGroupMovement(List<Player> group, Position target) {
        // Move players as coordinated unit
        // Maintain formation while moving
        // Optimize for group objectives
    }
}
```

## Game Balance

### Balance Considerations

#### Map Design
- **Size vs Players**: Larger maps favor defensive strategies
- **Food Density**: More food leads to larger armies
- **Obstacle Placement**: Affects movement and strategy options
- **Spawn Point Distance**: Impacts early game dynamics

#### Timing Parameters
- **Spawn Duration**: 8 turns of guaranteed spawning
- **Visibility Range**: 5-move radius balances information vs fog of war
- **Combat Range**: 2-move range for outnumbering
- **Bot Timeout**: Prevents infinite loops while allowing complex strategies

#### Victory Conditions
- **Turn Limit**: Prevents infinite games
- **Elimination**: Clear victory condition
- **Tie Breaking**: Fair resolution of draws

### Balancing Tools

#### Configuration Parameters
```yaml
game_settings:
  map_width: 50
  map_height: 50
  max_turns: 200
  spawn_turns: 8
  visibility_range: 5
  combat_range: 2
  bot_timeout_ms: 5000
  food_spawn_rate: 0.1
```

#### Dynamic Adjustments
- **Food Scaling**: Adjust food spawn rate based on player count
- **Map Scaling**: Larger maps for more teams
- **Turn Scaling**: Longer games for larger maps

## Technical Implementation

### Game Engine Architecture

#### Core Components
- **GameEngine**: Main game logic coordinator
- **TurnProcessor**: Handles individual turn execution
- **CombatResolver**: Manages collision and combat calculations
- **StateManager**: Tracks and updates game state
- **ValidationEngine**: Ensures move legality

#### Processing Pipeline
```java
public class GameEngine {
    public GameResult processTurn(List<BotMoves> allMoves) {
        // 1. Validate all moves
        List<Move> validMoves = validateMoves(allMoves);
        
        // 2. Execute movement
        GameState newState = executeMovement(validMoves);
        
        // 3. Resolve combat
        newState = resolveCombat(newState);
        
        // 4. Process collections
        newState = processCollections(newState);
        
        // 5. Spawn new players
        newState = spawnNewPlayers(newState);
        
        // 6. Update turn counter
        newState = incrementTurn(newState);
        
        return new GameResult(newState, getGameEvents());
    }
}
```

### Performance Considerations

#### Optimization Strategies
- **Spatial Indexing**: Efficient collision detection
- **Lazy Evaluation**: Only calculate visible areas
- **Caching**: Cache expensive calculations between turns
- **Parallel Processing**: Process independent bot moves simultaneously

#### Scalability Limits
- **Map Size**: O(n²) complexity for large maps
- **Player Count**: O(n²) for combat calculations
- **Bot Complexity**: Timeout prevents infinite computation
- **Memory Usage**: State size grows with game complexity

## Event System

### Game Events

#### Event Types
- **PlayerMoved**: Player changed position
- **PlayerDied**: Player was eliminated
- **PlayerSpawned**: New player created
- **CollectableCollected**: Food item collected
- **SpawnPointDestroyed**: Team spawn point eliminated
- **BotDisqualified**: Bot violated rules
- **GameEnded**: Game reached conclusion

#### Event Structure
```java
public abstract class GameEvent {
    private final int turn;
    private final long timestamp;
    
    public abstract EventType getType();
    public abstract String getDescription();
}

public class PlayerMovedEvent extends GameEvent {
    private final String playerId;
    private final Position from;
    private final Position to;
}
```

### Event Broadcasting

#### WebSocket Integration
- **Real-time Updates**: Events broadcast immediately
- **Client Filtering**: Clients can subscribe to specific event types
- **Replay Support**: Events stored for game replay functionality
- **Analytics**: Events used for post-game analysis

## Testing and Validation

### Game Logic Testing

#### Unit Tests
- **Move Validation**: Test all move validation rules
- **Combat Resolution**: Verify collision and outnumbering logic
- **State Transitions**: Ensure proper state updates
- **Edge Cases**: Test boundary conditions and error cases

#### Integration Tests
- **Full Game Simulation**: Run complete games with test bots
- **Multi-bot Scenarios**: Test complex interactions
- **Performance Tests**: Verify acceptable execution times
- **Stress Tests**: Large maps and many players

### Bot Testing Framework

#### Test Utilities
```java
public class BotTestFramework {
    public GameState createTestState(int width, int height) {
        // Create controlled test environment
    }
    
    public void simulateGame(Bot bot1, Bot bot2, GameSettings settings) {
        // Run full game simulation
    }
    
    public List<Move> validateBotMoves(Bot bot, GameState state) {
        // Test bot move generation
    }
}
```

#### Automated Testing
- **Regression Tests**: Ensure consistent bot behavior
- **Performance Benchmarks**: Measure bot execution time
- **Strategy Validation**: Verify bot implements intended strategy
- **Error Handling**: Test bot response to invalid states

## Future Enhancements

### Potential Features

#### Game Mechanics
- **Power-ups**: Special abilities or temporary bonuses
- **Terrain Effects**: Different movement costs or abilities
- **Team Alliances**: Temporary partnerships between teams
- **Resource Management**: Multiple resource types beyond food

#### Technical Improvements
- **Machine Learning**: AI opponents that learn and adapt
- **Replay System**: Full game replay with analysis tools
- **Tournament Brackets**: Automated tournament management
- **Real-time Spectating**: Live viewing with commentary features

#### Developer Experience
- **Visual Debugger**: Step-through bot decision making
- **Strategy Templates**: Pre-built bot strategies for learning
- **Performance Profiler**: Analyze bot execution efficiency
- **Collaborative Development**: Team-based bot development tools

### Extensibility Points

#### Plugin Architecture
- **Custom Game Modes**: Different victory conditions or rules
- **Map Generators**: Procedural or custom map creation
- **Bot Templates**: Language-specific starter templates
- **Visualization Plugins**: Custom rendering or analysis tools

#### API Extensions
- **Statistics API**: Detailed game and bot performance metrics
- **Replay API**: Access to historical game data
- **Tournament API**: Automated competition management
- **Analytics API**: Advanced data analysis capabilities