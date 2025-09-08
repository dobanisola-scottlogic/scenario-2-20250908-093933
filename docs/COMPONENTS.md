# Component Documentation

## Overview

The Hackathon Game Platform consists of multiple interconnected components, each serving a specific purpose in the overall system. This document provides detailed information about each component, its responsibilities, and how it integrates with other parts of the system.

## Core Components

### 1. Game (`/game`)

**Purpose**: Defines the core game API and data structures that all other components use.

**Key Responsibilities**:
- Define game entities (Bot, Player, GameState, Move, etc.)
- Provide interfaces for bot implementations
- Define game rules and constraints
- Establish data contracts between components

**Key Classes**:
- `Bot`: Abstract base class for all bot implementations
- `GameState`: Represents the current state of the game
- `Player`: Represents individual players on the game board
- `Move`: Represents a single player movement
- `Position`: Represents coordinates on the game grid
- `SpawnPoint`: Represents team spawn locations
- `Collectable`: Represents food items on the board

**Dependencies**: None (base component)

**Used By**: game-engine, server, default-bots, remote, contestants

---

### 2. Game Engine (`/game-engine`)

**Purpose**: Implements the core game logic and rules enforcement.

**Key Responsibilities**:
- Execute game turns and phases
- Validate bot moves and enforce rules
- Handle player interactions (collisions, combat, collection)
- Manage game state transitions
- Calculate game outcomes and results

**Key Features**:
- Turn-based game execution
- Collision detection and resolution
- Line-of-sight calculations for limited visibility
- Combat resolution based on player positioning
- Food spawning and collection mechanics
- Spawn point destruction mechanics

**Dependencies**: game

**Used By**: server

---

### 3. Server (`/server`)

**Purpose**: Web application server providing REST API, WebSocket communication, and admin interface.

**Key Responsibilities**:
- Host REST API for game management
- Provide WebSocket endpoints for real-time updates
- Manage game sessions and tournaments
- Handle bot registration and authentication
- Serve admin interface for event management
- Persist game data to database

**Technology Stack**:
- **Dropwizard**: Web application framework
- **Guice**: Dependency injection
- **Hibernate**: Database ORM
- **Jetty**: Embedded web server
- **WebSocket**: Real-time communication

**API Endpoints**:
- `/api/games`: Game management
- `/api/bots`: Bot registration and management
- `/api/tournaments`: Tournament operations
- `/admin`: Administrative interface
- `/ws`: WebSocket connections

**Dependencies**: game, game-engine, default-bots, remote

**Used By**: ui, contestant environments

---

### 4. UI (`/ui`)

**Purpose**: Modern React-based web interface for game visualization and management.

**Key Responsibilities**:
- Provide real-time game visualization
- Display game statistics and leaderboards
- Offer tournament management interface
- Enable bot registration and configuration
- Show game replay functionality

**Technology Stack**:
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Material-UI**: Component library
- **Redux Toolkit**: State management
- **Phaser**: Game rendering engine
- **C3.js**: Charts and graphs

**Key Features**:
- Real-time game board visualization
- Interactive game controls
- Responsive design for multiple screen sizes
- WebSocket integration for live updates
- Tournament bracket visualization

**Dependencies**: None (communicates with server via HTTP/WebSocket)

**Used By**: Event organizers, spectators

---

### 5. Viewer (`/viewer`)

**Purpose**: Legacy web interface (being replaced by UI component).

**Status**: Deprecated - being phased out in favor of the modern UI component.

**Dependencies**: None

---

### 6. Default Bots (`/default-bots`)

**Purpose**: Provides built-in bot strategies for testing and demonstration.

**Key Responsibilities**:
- Implement various AI strategies
- Provide baseline opponents for contestants
- Demonstrate different gameplay approaches
- Enable single-player testing scenarios

**Bot Strategies**:
- Random movement bot
- Aggressive combat bot
- Defensive positioning bot
- Food collection focused bot
- Balanced strategy bot

**Dependencies**: game

**Used By**: server (for built-in opponents)

---

### 7. Remote (`/remote`)

**Purpose**: Distributed client for executing contestant bot code remotely.

**Key Responsibilities**:
- Execute contestant code in isolated environments
- Communicate with game server via network
- Handle bot lifecycle management
- Provide security isolation for untrusted code
- Support multiple programming languages

**Key Features**:
- Sandboxed code execution
- Network communication with game server
- Timeout and resource limit enforcement
- Multi-language support (Java, Python)
- Error handling and reporting

**Dependencies**: game

**Used By**: Contestant development environments

---

### 8. Java Contestant (`/java-contestant`)

**Purpose**: Java development environment and template for contestants.

**Key Responsibilities**:
- Provide Java bot template and examples
- Include development dependencies and build configuration
- Offer local testing capabilities
- Integrate with remote execution environment

**Contents**:
- Bot implementation templates
- Gradle build configuration
- Example strategies and utilities
- Local testing framework
- Documentation and guides

**Dependencies**: game, remote

**Target Users**: Java developers participating in hackathons

---

### 9. Python Contestant (`/python-contestant`)

**Purpose**: Python development environment and template for contestants.

**Key Responsibilities**:
- Provide Python bot template and examples
- Include development dependencies and requirements
- Offer local testing capabilities
- Integrate with remote execution environment

**Contents**:
- Bot implementation templates
- Requirements.txt and setup configuration
- Example strategies and utilities
- Local testing framework
- Documentation and guides

**Dependencies**: game (via Python bindings), remote

**Target Users**: Python developers participating in hackathons

---

### 10. Deployment (`/deployment`)

**Purpose**: Infrastructure automation and deployment scripts.

**Key Responsibilities**:
- Automate AWS infrastructure provisioning
- Manage Docker container deployment
- Configure development environments
- Handle CI/CD pipeline integration

**Deployment Strategies**:

#### Terraform Deployment (Recommended)
- **Infrastructure as Code**: Complete AWS infrastructure definition
- **Scalable**: Auto-scaling groups and load balancers
- **Secure**: VPC, security groups, and IAM roles
- **Managed Services**: RDS, ECS, ECR integration

#### Docker Compose (Local/Development)
- **Simple Setup**: Single-machine deployment
- **Development Friendly**: Easy local testing
- **Cost Effective**: No cloud costs for small events

**Key Files**:
- `terraform/`: Infrastructure as Code definitions
- `docker-compose.yml`: Local deployment configuration
- `push-to-aws.sh`: Container deployment script

**Dependencies**: server, ui (for deployment artifacts)

**Used By**: DevOps, event organizers

## Component Interaction Patterns

### Game Execution Flow
```
1. Server creates game instance using game-engine
2. Bots register via server REST API
3. Game-engine calls bot.makeMoves() via remote clients
4. Game-engine processes moves and updates state
5. Server broadcasts state updates via WebSocket
6. UI receives updates and renders visualization
7. Process repeats for each game turn
```

### Bot Development Flow
```
1. Contestant accesses Cloud9/VSCode environment
2. Implements Bot class using provided templates
3. Tests locally using included test framework
4. Submits bot via remote client to server
5. Bot participates in games managed by server
6. Results displayed in UI and stored in database
```

### Deployment Flow
```
1. Code changes committed to repository
2. CI/CD pipeline builds and tests components
3. Docker images created and pushed to ECR
4. Terraform applies infrastructure changes
5. ECS deploys updated containers
6. Health checks verify successful deployment
```

## Configuration Management

### Environment Variables
- `DATABASE_URL`: Database connection string
- `AWS_REGION`: AWS region for cloud services
- `CONTESTANT_PASSWORD`: Authentication for contestant environments
- `WORKSPACE`: Cloud9 workspace identifier

### Configuration Files
- `server/server.yml`: Dropwizard server configuration
- `ui/vite.config.ts`: Frontend build configuration
- `deployment/terraform/`: Infrastructure configuration
- `docker-compose.yml`: Local deployment settings

## Testing Strategy

### Unit Testing
- **Java Components**: JUnit 5 with Mockito
- **TypeScript Components**: Vitest with Testing Library
- **Coverage Requirements**: Minimum 19% (configurable)

### Integration Testing
- **Server**: Dropwizard testing framework
- **Database**: H2 in-memory database for tests
- **API**: REST endpoint testing

### End-to-End Testing
- **UI**: Playwright for browser automation
- **Game Flow**: Complete game execution tests
- **Multi-component**: Full system integration tests

## Performance Considerations

### Scalability Bottlenecks
- **Game Engine**: CPU-intensive calculations during game execution
- **Database**: Concurrent access during high-traffic events
- **WebSocket**: Connection limits for real-time updates

### Optimization Strategies
- **Caching**: Game state caching for frequently accessed data
- **Connection Pooling**: Database connection management
- **Async Processing**: Non-blocking operations where possible
- **Load Balancing**: Multiple server instances for high availability

## Security Considerations

### Code Execution Security
- **Sandboxing**: Isolated execution environments for contestant code
- **Resource Limits**: CPU and memory constraints
- **Timeout Protection**: Prevent infinite loops and hanging processes

### Network Security
- **Authentication**: Secure admin and contestant access
- **CORS**: Controlled cross-origin resource sharing
- **Input Validation**: Sanitization of all user inputs

### Infrastructure Security
- **VPC**: Isolated network environments
- **Security Groups**: Firewall rules for AWS resources
- **IAM**: Least-privilege access controls