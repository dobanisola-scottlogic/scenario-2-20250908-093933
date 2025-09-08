# Development Guide

## Overview

This guide provides comprehensive information for developers who want to contribute to the Hackathon Game Platform. It covers development environment setup, coding standards, testing practices, and contribution workflows.

## Development Environment Setup

### Prerequisites

#### Required Software
- **Java 21**: OpenJDK or Oracle JDK
- **Node.js 18+**: For frontend development
- **Git**: Version control
- **Docker**: For containerized development (optional)
- **PostgreSQL**: Database (or use H2 for development)

#### Recommended Tools
- **IntelliJ IDEA**: Java development IDE
- **VS Code**: Frontend development and general editing
- **Postman**: API testing
- **pgAdmin**: PostgreSQL administration

### Initial Setup

#### 1. Clone Repository
```bash
git clone https://github.com/your-org/hackathon-game-platform.git
cd hackathon-game-platform
```

#### 2. Environment Configuration
Create local configuration files:

**server/server-dev.yml**:
```yaml
server:
  applicationConnectors:
    - type: http
      port: 8080
      bindHost: 0.0.0.0
  adminConnectors:
    - type: http
      port: 8081

database:
  driverClass: org.h2.Driver
  url: jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1
  user: sa
  password: ""
  properties:
    hibernate.dialect: org.hibernate.dialect.H2Dialect
    hibernate.hbm2ddl.auto: create-drop

logging:
  level: DEBUG
  loggers:
    com.scottlogic.hackathon: TRACE
```

**ui/.env.development**:
```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_TOURNAMENTS=true
```

#### 3. Build and Verify
```bash
# Build all components
./gradlew build

# Run tests
./gradlew test

# Start server
./gradlew :server:run

# In separate terminal, start UI
cd ui
npm install
npm run dev
```

#### 4. Verify Installation
- Server: http://localhost:8080/health
- Admin: http://localhost:8080/admin (admin/secret)
- UI: http://localhost:5173
- API Docs: http://localhost:8080/swagger

## Project Structure

### Module Organization
```
hackathon-game-platform/
├── game/                    # Core game API and interfaces
├── game-engine/            # Game logic implementation
├── server/                 # Web server and REST API
├── ui/                     # Modern React frontend
├── viewer/                 # Legacy frontend (deprecated)
├── default-bots/          # Built-in bot strategies
├── remote/                # Distributed bot execution
├── java-contestant/       # Java contestant template
├── python-contestant/     # Python contestant template
├── deployment/            # Infrastructure and deployment
├── docs/                  # Documentation
├── build.gradle           # Root build configuration
├── settings.gradle        # Module configuration
└── README.md              # Project overview
```

### Key Directories

#### Backend (Java)
```
server/src/main/java/com/scottlogic/hackathon/server/
├── HackathonApplication.java    # Main application class
├── config/                      # Configuration classes
├── resources/                   # REST endpoints
├── services/                    # Business logic
├── dao/                        # Data access objects
├── entities/                   # Database entities
├── websocket/                  # WebSocket handlers
└── health/                     # Health checks
```

#### Frontend (TypeScript/React)
```
ui/src/
├── components/                 # Reusable UI components
├── pages/                     # Page-level components
├── api/                       # API client code
├── hooks/                     # Custom React hooks
├── store/                     # Redux store configuration
├── slices/                    # Redux state slices
├── utils/                     # Utility functions
├── interfaces/                # TypeScript interfaces
├── enums/                     # TypeScript enums
└── theme.ts                   # Material-UI theme
```

## Development Workflow

### Git Workflow

#### Branch Naming Convention
- `feature/description`: New features
- `bugfix/description`: Bug fixes
- `hotfix/description`: Critical production fixes
- `refactor/description`: Code refactoring
- `docs/description`: Documentation updates

#### Commit Message Format
```
type(scope): brief description

Detailed explanation of changes (if needed)

Fixes #issue-number
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Examples**:
```
feat(game-engine): add collision detection for diagonal moves

Implements proper collision detection when players move diagonally,
ensuring consistent behavior with horizontal/vertical movement.

Fixes #123
```

### Development Process

#### 1. Create Feature Branch
```bash
git checkout -b feature/new-game-mode
```

#### 2. Make Changes
Follow coding standards and write tests for new functionality.

#### 3. Run Quality Checks
```bash
# Format code
./gradlew spotlessApply

# Run all tests
./gradlew check

# Frontend linting
cd ui
npm run lint:fix
npm run test
```

#### 4. Commit Changes
```bash
git add .
git commit -m "feat(game): add new tournament mode"
```

#### 5. Push and Create PR
```bash
git push origin feature/new-game-mode
# Create pull request via GitHub/GitLab interface
```

## Coding Standards

### Java Standards

#### Code Style
- **Indentation**: 2 spaces
- **Line Length**: 100 characters maximum
- **Imports**: Organized and unused imports removed
- **Naming**: CamelCase for classes, camelCase for methods/variables

#### Best Practices
```java
// Use Lombok to reduce boilerplate
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameState {
    private final List<Player> players;
    private final int currentTurn;
}

// Use Optional for nullable values
public Optional<Player> findPlayerById(String id) {
    return players.stream()
        .filter(player -> player.getId().equals(id))
        .findFirst();
}

// Use meaningful variable names
public List<Move> calculateOptimalMoves(GameState gameState) {
    List<Player> availablePlayers = gameState.getMyPlayers();
    List<Collectable> nearbyCollectables = findNearbyCollectables(availablePlayers);
    return generateMovesTowards(availablePlayers, nearbyCollectables);
}
```

#### Documentation
```java
/**
 * Calculates the optimal moves for all players based on current game state.
 * 
 * @param gameState Current state of the game including player positions
 * @return List of moves that maximize score potential
 * @throws IllegalArgumentException if gameState is null or invalid
 */
public List<Move> calculateOptimalMoves(GameState gameState) {
    // Implementation
}
```

### TypeScript/React Standards

#### Code Style
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Always use semicolons
- **Naming**: PascalCase for components, camelCase for functions/variables

#### Component Structure
```typescript
// Functional component with TypeScript
interface GameBoardProps {
  gameState: GameState;
  onPlayerMove: (playerId: string, direction: Direction) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ 
  gameState, 
  onPlayerMove 
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  
  const handleCellClick = useCallback((position: Position) => {
    if (selectedPlayer) {
      const direction = calculateDirection(selectedPlayer, position);
      onPlayerMove(selectedPlayer, direction);
    }
  }, [selectedPlayer, onPlayerMove]);

  return (
    <div className="game-board">
      {/* Component JSX */}
    </div>
  );
};
```

#### State Management
```typescript
// Redux slice with TypeScript
interface GameSliceState {
  currentGame: GameState | null;
  isLoading: boolean;
  error: string | null;
}

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    currentGame: null,
    isLoading: false,
    error: null,
  } as GameSliceState,
  reducers: {
    setGameState: (state, action: PayloadAction<GameState>) => {
      state.currentGame = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});
```

## Testing Strategy

### Backend Testing

#### Unit Tests
```java
@ExtendWith(MockitoExtension.class)
class GameEngineTest {
    
    @Mock
    private GameState mockGameState;
    
    @InjectMocks
    private GameEngine gameEngine;
    
    @Test
    void shouldProcessValidMoves() {
        // Given
        List<Move> moves = Arrays.asList(
            new MoveImpl(player1, Direction.NORTH),
            new MoveImpl(player2, Direction.EAST)
        );
        when(mockGameState.getMyPlayers()).thenReturn(Arrays.asList(player1, player2));
        
        // When
        GameResult result = gameEngine.processTurn(moves, mockGameState);
        
        // Then
        assertThat(result.isSuccessful()).isTrue();
        assertThat(result.getUpdatedPositions()).hasSize(2);
    }
    
    @Test
    void shouldRejectInvalidMoves() {
        // Test invalid move scenarios
    }
}
```

#### Integration Tests
```java
@ExtendWith(DropwizardExtensionsSupport.class)
class GameResourceIntegrationTest {
    
    private static final DropwizardAppExtension<HackathonConfiguration> APP = 
        new DropwizardAppExtension<>(HackathonApplication.class, "test-config.yml");
    
    @Test
    void shouldCreateNewGame() {
        // Given
        CreateGameRequest request = CreateGameRequest.builder()
            .name("Test Game")
            .maxPlayers(4)
            .build();
        
        // When
        Response response = APP.client()
            .target("http://localhost:" + APP.getLocalPort() + "/api/games")
            .request()
            .post(Entity.json(request));
        
        // Then
        assertThat(response.getStatus()).isEqualTo(201);
        GameResponse gameResponse = response.readEntity(GameResponse.class);
        assertThat(gameResponse.getName()).isEqualTo("Test Game");
    }
}
```

### Frontend Testing

#### Component Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { GameBoard } from './GameBoard';

describe('GameBoard', () => {
  const mockGameState: GameState = {
    players: [
      { id: 'player1', position: { x: 5, y: 5 }, team: 'team1' }
    ],
    collectables: [],
    currentTurn: 1
  };

  it('should render game board with players', () => {
    render(
      <GameBoard 
        gameState={mockGameState} 
        onPlayerMove={jest.fn()} 
      />
    );
    
    expect(screen.getByTestId('game-board')).toBeInTheDocument();
    expect(screen.getByTestId('player-player1')).toBeInTheDocument();
  });

  it('should call onPlayerMove when player is moved', () => {
    const mockOnPlayerMove = jest.fn();
    
    render(
      <GameBoard 
        gameState={mockGameState} 
        onPlayerMove={mockOnPlayerMove} 
      />
    );
    
    fireEvent.click(screen.getByTestId('player-player1'));
    fireEvent.click(screen.getByTestId('cell-5-6'));
    
    expect(mockOnPlayerMove).toHaveBeenCalledWith('player1', Direction.NORTH);
  });
});
```

#### End-to-End Tests
```typescript
import { test, expect } from '@playwright/test';

test('complete game flow', async ({ page }) => {
  // Navigate to application
  await page.goto('http://localhost:3000');
  
  // Create new game
  await page.click('[data-testid="create-game-button"]');
  await page.fill('[data-testid="game-name-input"]', 'E2E Test Game');
  await page.click('[data-testid="submit-button"]');
  
  // Verify game creation
  await expect(page.locator('[data-testid="game-title"]')).toContainText('E2E Test Game');
  
  // Add bots and start game
  await page.click('[data-testid="add-bot-button"]');
  await page.selectOption('[data-testid="bot-select"]', 'RandomBot');
  await page.click('[data-testid="start-game-button"]');
  
  // Verify game is running
  await expect(page.locator('[data-testid="game-status"]')).toContainText('Running');
});
```

### Test Data Management

#### Test Fixtures
```java
public class TestDataFactory {
    
    public static GameState createBasicGameState() {
        return GameState.builder()
            .players(Arrays.asList(
                createPlayer("player1", new Position(5, 5)),
                createPlayer("player2", new Position(10, 10))
            ))
            .collectables(Arrays.asList(
                new Collectable(new Position(15, 15))
            ))
            .currentTurn(1)
            .build();
    }
    
    public static Player createPlayer(String id, Position position) {
        return Player.builder()
            .id(id)
            .position(position)
            .team("team1")
            .alive(true)
            .build();
    }
}
```

## Debugging

### Backend Debugging

#### IntelliJ IDEA Setup
1. Create run configuration for `HackathonApplication`
2. Set program arguments: `server server-dev.yml`
3. Set breakpoints in code
4. Run in debug mode

#### Logging Configuration
```yaml
logging:
  level: DEBUG
  loggers:
    com.scottlogic.hackathon: TRACE
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

#### Common Debug Points
- Bot move validation in `GameEngine`
- WebSocket message handling
- Database query execution
- REST endpoint processing

### Frontend Debugging

#### Browser DevTools
- Use React Developer Tools extension
- Redux DevTools for state inspection
- Network tab for API call debugging
- Console for JavaScript errors

#### VS Code Debugging
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug React App",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/ui/node_modules/.bin/vite",
      "args": ["--mode", "development"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## Performance Optimization

### Backend Performance

#### Database Optimization
```java
// Use batch operations for bulk inserts
@Transactional
public void savePlayers(List<Player> players) {
    for (int i = 0; i < players.size(); i++) {
        entityManager.persist(players.get(i));
        if (i % 50 == 0) {
            entityManager.flush();
            entityManager.clear();
        }
    }
}

// Use appropriate fetch strategies
@Entity
public class Game {
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Player> players;
}
```

#### Caching Strategy
```java
@Service
public class GameService {
    
    @Cacheable(value = "gameStates", key = "#gameId")
    public GameState getGameState(String gameId) {
        return gameRepository.findById(gameId)
            .map(this::convertToGameState)
            .orElse(null);
    }
    
    @CacheEvict(value = "gameStates", key = "#gameId")
    public void updateGameState(String gameId, GameState newState) {
        // Update logic
    }
}
```

### Frontend Performance

#### Component Optimization
```typescript
// Use React.memo for expensive components
export const GameBoard = React.memo<GameBoardProps>(({ 
  gameState, 
  onPlayerMove 
}) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return prevProps.gameState.currentTurn === nextProps.gameState.currentTurn;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return calculateComplexGameStatistics(gameState);
}, [gameState.players, gameState.currentTurn]);
```

#### Bundle Optimization
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
          game: ['phaser']
        }
      }
    }
  }
});
```

## Contributing Guidelines

### Pull Request Process

1. **Fork and Branch**: Create feature branch from main
2. **Implement**: Write code following standards
3. **Test**: Ensure all tests pass and add new tests
4. **Document**: Update documentation if needed
5. **Review**: Submit PR with clear description
6. **Address Feedback**: Respond to review comments
7. **Merge**: Maintainer merges after approval

### Code Review Checklist

#### Functionality
- [ ] Code solves the intended problem
- [ ] Edge cases are handled appropriately
- [ ] Error handling is comprehensive
- [ ] Performance impact is acceptable

#### Code Quality
- [ ] Code follows project standards
- [ ] Variable and function names are descriptive
- [ ] Code is well-structured and readable
- [ ] No code duplication

#### Testing
- [ ] Unit tests cover new functionality
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] No regression in existing functionality

#### Documentation
- [ ] Code is self-documenting or well-commented
- [ ] API documentation updated if needed
- [ ] README updated for new features
- [ ] Migration guide provided for breaking changes

### Issue Reporting

#### Bug Reports
```markdown
**Bug Description**
Clear description of the issue

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Ubuntu 20.04]
- Java Version: [e.g., OpenJDK 21]
- Browser: [e.g., Chrome 91]

**Additional Context**
Screenshots, logs, or other relevant information
```

#### Feature Requests
```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other approaches that were considered

**Additional Context**
Mockups, examples, or related issues
```

## Release Process

### Version Management
- **Semantic Versioning**: MAJOR.MINOR.PATCH
- **Release Branches**: `release/v1.2.0`
- **Hotfix Branches**: `hotfix/v1.2.1`

### Release Checklist
1. [ ] Update version numbers
2. [ ] Update CHANGELOG.md
3. [ ] Run full test suite
4. [ ] Build and test Docker images
5. [ ] Update documentation
6. [ ] Create release branch
7. [ ] Deploy to staging environment
8. [ ] Perform acceptance testing
9. [ ] Tag release
10. [ ] Deploy to production
11. [ ] Monitor deployment
12. [ ] Announce release

### Deployment Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    tags: ['v*']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '21'
      - run: ./gradlew test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker images
        run: |
          ./gradlew :server:dockerBuild
          docker build -t hackathon-ui ./ui
      - name: Deploy to AWS
        run: |
          # Deployment commands
```