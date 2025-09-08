# System Architecture

## Overview

The Hackathon Game Platform is a comprehensive multi-component system designed to host programming competitions where contestants develop AI bots to play a strategic grid-based game. The platform provides a complete ecosystem including game engine, web server, user interface, deployment infrastructure, and contestant development environments.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Hackathon Game Platform                     │
├─────────────────────────────────────────────────────────────────┤
│  Frontend Layer                                                 │
│  ┌─────────────────┐  ┌─────────────────┐                     │
│  │   Modern UI     │  │  Legacy Viewer  │                     │
│  │  (React/Vite)   │  │   (Deprecated)  │                     │
│  └─────────────────┘  └─────────────────┘                     │
├─────────────────────────────────────────────────────────────────┤
│  Application Layer                                              │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              Game Server (Dropwizard)                      │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │ │
│  │  │   REST API  │ │ WebSocket   │ │   Admin Interface   │  │ │
│  │  │             │ │   Events    │ │                     │  │ │
│  │  └─────────────┘ └─────────────┘ └─────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Game Logic Layer                                               │
│  ┌─────────────────┐  ┌─────────────────┐                     │
│  │   Game Engine   │  │   Game API      │                     │
│  │  (Core Logic)   │  │  (Interfaces)   │                     │
│  └─────────────────┘  └─────────────────┘                     │
├─────────────────────────────────────────────────────────────────┤
│  Bot Execution Layer                                            │
│  ┌─────────────────┐  ┌─────────────────┐                     │
│  │  Remote Client  │  │  Default Bots   │                     │
│  │  (Distributed)  │  │  (Built-in AI)  │                     │
│  └─────────────────┘  └─────────────────┘                     │
├─────────────────────────────────────────────────────────────────┤
│  Data Layer                                                     │
│  ┌─────────────────┐  ┌─────────────────┐                     │
│  │   PostgreSQL    │  │      H2         │                     │
│  │  (Production)   │  │  (Development)  │                     │
│  └─────────────────┘  └─────────────────┘                     │
├─────────────────────────────────────────────────────────────────┤
│  Infrastructure Layer                                           │
│  ┌─────────────────┐  ┌─────────────────┐                     │
│  │   AWS Cloud     │  │   Docker        │                     │
│  │  (Terraform)    │  │  (Containers)   │                     │
│  └─────────────────┘  └─────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘

External Components:
┌─────────────────┐  ┌─────────────────┐
│  Java Contestant│  │ Python Contestant│
│   Environment   │  │   Environment    │
│  (Cloud9/VSCode)│  │  (Cloud9/VSCode) │
└─────────────────┘  └─────────────────┘
```

## Technology Stack

### Backend Technologies
- **Java 21**: Primary backend language
- **Dropwizard**: Web application framework
- **Guice**: Dependency injection framework
- **Hibernate**: ORM for database operations
- **PostgreSQL**: Production database
- **H2**: Development/testing database
- **Jetty**: Embedded web server
- **WebSocket**: Real-time communication
- **Gradle**: Build automation

### Frontend Technologies
- **React 18**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and development server
- **Material-UI (MUI)**: Component library
- **Redux Toolkit**: State management
- **Phaser**: Game visualization engine
- **C3.js**: Data visualization charts

### Infrastructure & DevOps
- **AWS**: Cloud platform
- **Terraform**: Infrastructure as Code
- **Docker**: Containerization
- **AWS ECR**: Container registry
- **AWS Cloud9**: Development environments
- **Azure Pipelines**: CI/CD

### Development Tools
- **Lombok**: Java boilerplate reduction
- **Spotless**: Code formatting
- **JUnit 5**: Java testing
- **Vitest**: JavaScript testing
- **Playwright**: End-to-end testing
- **ESLint/Prettier**: Code quality

## Component Relationships

### Core Dependencies
```
game-engine ──depends on──> game
server ──depends on──> game, game-engine, default-bots, remote
ui ──communicates with──> server (REST/WebSocket)
remote ──depends on──> game
default-bots ──depends on──> game
deployment ──orchestrates──> server, ui, database
```

### Data Flow
1. **Game Initialization**: Server creates game instance using game-engine
2. **Bot Registration**: Contestants register bots via REST API
3. **Game Execution**: Game-engine processes turns, calls bot strategies
4. **State Updates**: Server broadcasts game state via WebSocket
5. **UI Updates**: Frontend receives updates and renders game visualization
6. **Result Storage**: Game results persisted to database

## Security Architecture

### Authentication & Authorization
- Admin interface protected with basic authentication
- Team-based access control for contestant environments
- Environment variables for sensitive configuration

### Network Security
- CORS configuration for cross-origin requests
- WebSocket security for real-time communications
- AWS security groups for infrastructure protection

### Code Execution Security
- Sandboxed execution environments for contestant code
- Timeout mechanisms to prevent infinite loops
- Resource limits on bot execution

## Scalability Considerations

### Horizontal Scaling
- Stateless server design enables multiple instances
- Database connection pooling for concurrent access
- Load balancing capabilities through AWS infrastructure

### Performance Optimization
- Efficient game state calculations
- WebSocket for real-time updates (avoiding polling)
- Caching strategies for frequently accessed data
- Asynchronous processing for non-blocking operations

## Deployment Architecture

### Development Environment
- Local PostgreSQL or H2 database
- Gradle-based build and test execution
- Hot-reload capabilities for frontend development

### Production Environment
- AWS ECS for container orchestration
- RDS PostgreSQL for managed database
- CloudFormation/Terraform for infrastructure provisioning
- ECR for container image storage

## Monitoring & Observability

### Logging
- SLF4J logging framework
- Structured logging for better searchability
- Different log levels for development vs production

### Health Checks
- Dropwizard health checks for service monitoring
- Database connectivity monitoring
- Application-specific health indicators

### Metrics
- JVM metrics collection
- Application performance monitoring
- Game execution statistics

## Design Principles

### Modularity
- Clear separation of concerns between components
- Well-defined interfaces between modules
- Independent deployability of components

### Extensibility
- Plugin architecture for new bot strategies
- Configurable game rules and parameters
- Support for multiple programming languages

### Reliability
- Comprehensive error handling and recovery
- Graceful degradation of services
- Robust bot execution with timeout protection

### Maintainability
- Clean code practices with Lombok
- Comprehensive test coverage
- Automated code formatting and quality checks