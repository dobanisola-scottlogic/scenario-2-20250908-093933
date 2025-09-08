# Deployment Guide

## Overview

The Hackathon Game Platform supports multiple deployment strategies to accommodate different event sizes, budgets, and technical requirements. This guide covers all deployment options from local development to production AWS infrastructure.

## Deployment Options

### 1. Local Development
**Best for**: Development, testing, small demos
**Cost**: Free
**Complexity**: Low

### 2. Docker Compose
**Best for**: Small events, local hosting, proof of concept
**Cost**: Infrastructure costs only
**Complexity**: Medium

### 3. AWS Cloud (Terraform)
**Best for**: Production events, large scale, high availability
**Cost**: AWS service charges
**Complexity**: High

## Prerequisites

### General Requirements
- Git
- Java 21 or higher
- Node.js 18 or higher
- Docker and Docker Compose

### AWS Deployment Additional Requirements
- AWS CLI configured with appropriate permissions
- Terraform 1.0 or higher
- AWS account with sufficient quotas

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/hackathon-game-platform.git
cd hackathon-game-platform
```

### 2. Database Setup
Choose one of the following options:

#### Option A: H2 Database (Simplest)
No additional setup required. H2 will create an in-memory database automatically.

#### Option B: PostgreSQL (Recommended for development)
```bash
# Install PostgreSQL locally
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql

# Start PostgreSQL service
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# Create database and user
sudo -u postgres psql
CREATE DATABASE hackathon_game;
CREATE USER hackathon_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE hackathon_game TO hackathon_user;
\q
```

Update `server/server.yml`:
```yaml
database:
  driverClass: org.postgresql.Driver
  url: jdbc:postgresql://localhost:5432/hackathon_game
  user: hackathon_user
  password: your_password
  properties:
    hibernate.dialect: org.hibernate.dialect.PostgreSQLDialect
    hibernate.hbm2ddl.auto: update
```

### 3. Build and Run
```bash
# Build all components
./gradlew build

# Run the server
./gradlew :server:run

# In a separate terminal, run the UI
cd ui
npm install
npm run dev
```

### 4. Access the Application
- **Game Server**: http://localhost:8080
- **Admin Interface**: http://localhost:8080/admin (admin/secret)
- **Modern UI**: http://localhost:5173
- **API Documentation**: http://localhost:8080/api-docs

## Docker Compose Deployment

### 1. Prepare Environment
```bash
# Clone repository
git clone https://github.com/your-org/hackathon-game-platform.git
cd hackathon-game-platform
```

### 2. Build Docker Images
```bash
# Build server image
./gradlew :server:dockerBuild

# Build UI image
cd ui
docker build -t hackathon-ui .
cd ..
```

### 3. Deploy with Docker Compose
```bash
cd deployment
docker-compose up -d
```

### 4. Verify Deployment
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Access application
curl http://localhost:8080/health
```

### 5. Configuration
Edit `deployment/docker-compose.yml` to customize:
- Port mappings
- Environment variables
- Volume mounts
- Resource limits

### 6. Scaling
```bash
# Scale server instances
docker-compose up -d --scale server=3

# Scale with load balancer
docker-compose -f docker-compose.yml -f docker-compose.scale.yml up -d
```

## AWS Cloud Deployment (Terraform)

### 1. Prerequisites Setup

#### AWS CLI Configuration
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure credentials
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and default region
```

#### Terraform Installation
```bash
# Download and install Terraform
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```

### 2. Infrastructure Deployment

#### Build and Push Container Images
```bash
# Build and push server image to ECR
cd deployment
./push-to-aws.sh

# Build and push UI image
cd ../ui
docker build -t hackathon-ui .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag hackathon-ui:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/hackathon-ui:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/hackathon-ui:latest
```

#### Deploy Infrastructure
```bash
cd deployment/src/main/terraform

# Initialize Terraform
terraform init

# Review planned changes
terraform plan

# Apply infrastructure changes
terraform apply
```

### 3. Infrastructure Components

The Terraform deployment creates:

#### Networking
- **VPC**: Isolated network environment
- **Subnets**: Public and private subnets across multiple AZs
- **Internet Gateway**: Internet access for public resources
- **NAT Gateway**: Outbound internet access for private resources
- **Security Groups**: Firewall rules for different components

#### Compute
- **ECS Cluster**: Container orchestration
- **ECS Services**: Auto-scaling container services
- **Application Load Balancer**: Traffic distribution
- **Auto Scaling Groups**: Automatic capacity management

#### Storage
- **RDS PostgreSQL**: Managed database service
- **EFS**: Shared file system for persistent data
- **S3 Buckets**: Static asset storage and backups

#### Development Environments
- **Cloud9 Instances**: One per team for contestant development
- **IAM Roles**: Secure access to AWS services
- **EC2 Instances**: Dedicated development environments

### 4. Configuration Variables

Create `terraform.tfvars`:
```hcl
# Basic Configuration
project_name = "hackathon-game"
environment = "production"
aws_region = "us-east-1"

# Networking
vpc_cidr = "10.0.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]

# Database
db_instance_class = "db.t3.medium"
db_allocated_storage = 100
db_backup_retention_period = 7

# ECS Configuration
server_cpu = 1024
server_memory = 2048
server_desired_count = 2

# Team Configuration
teams = [
  {
    name = "team-alpha"
    instance_type = "t3.medium"
  },
  {
    name = "team-beta"
    instance_type = "t3.medium"
  }
]

# Domain Configuration (optional)
domain_name = "hackathon.example.com"
certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"
```

### 5. Post-Deployment Configuration

#### Database Migration
```bash
# Connect to ECS task to run migrations
aws ecs execute-command \
  --cluster hackathon-game-cluster \
  --task <task-id> \
  --container server \
  --interactive \
  --command "/bin/bash"

# Inside container, run migrations if needed
java -jar app.jar db migrate server.yml
```

#### SSL Certificate Setup
```bash
# Request SSL certificate (if not using existing)
aws acm request-certificate \
  --domain-name hackathon.example.com \
  --validation-method DNS \
  --region us-east-1
```

#### DNS Configuration
Update your DNS provider to point to the Application Load Balancer:
```
hackathon.example.com -> <alb-dns-name>
```

### 6. Monitoring and Logging

#### CloudWatch Setup
```bash
# Create log groups
aws logs create-log-group --log-group-name /ecs/hackathon-server
aws logs create-log-group --log-group-name /ecs/hackathon-ui

# Set up alarms
aws cloudwatch put-metric-alarm \
  --alarm-name "hackathon-high-cpu" \
  --alarm-description "High CPU utilization" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

## Team Environment Setup

### Cloud9 Configuration

Each team gets a dedicated Cloud9 environment with:
- Pre-installed development tools
- Git repository access
- Direct connection to game server
- Isolated workspace

#### Automatic Setup Script
```bash
#!/bin/bash
# This script runs on each Cloud9 instance

# Install Java 21
sudo yum update -y
sudo yum install -y java-21-amazon-corretto-devel

# Install Python 3.11
sudo yum install -y python3.11 python3.11-pip

# Clone contestant templates
git clone https://github.com/your-org/hackathon-game-platform.git
cd hackathon-game-platform

# Setup Java environment
cd java-contestant
./gradlew build

# Setup Python environment
cd ../python-contestant
pip3.11 install -r requirements.txt

# Configure environment variables
echo "export GAME_SERVER_URL=https://hackathon.example.com" >> ~/.bashrc
echo "export TEAM_NAME=${TEAM_NAME}" >> ~/.bashrc
```

### Manual Team Setup

If not using automated deployment:

1. **Create Cloud9 Environment**
   - Instance type: t3.medium or larger
   - Platform: Amazon Linux 2
   - Network: Same VPC as game server

2. **Configure Access**
   - Add team members to Cloud9 environment
   - Set up IAM permissions for game server access

3. **Install Dependencies**
   ```bash
   # Run the setup script above
   ```

## Environment Configuration

### Environment Variables

#### Server Configuration
```bash
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/hackathon_game
DATABASE_USER=hackathon_user
DATABASE_PASSWORD=secure_password

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Application Settings
CONTESTANT_PASSWORD=team_password
WORKSPACE=hackathon_workspace
SERVER_PORT=8080
```

#### UI Configuration
```bash
# API Endpoints
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_TOURNAMENTS=true
```

### Configuration Files

#### server.yml
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
  driverClass: org.postgresql.Driver
  url: ${DATABASE_URL}
  user: ${DATABASE_USER}
  password: ${DATABASE_PASSWORD}
  properties:
    hibernate.dialect: org.hibernate.dialect.PostgreSQLDialect
    hibernate.hbm2ddl.auto: update

logging:
  level: INFO
  loggers:
    com.scottlogic.hackathon: DEBUG
  appenders:
    - type: console
    - type: file
      currentLogFilename: logs/application.log
      archivedLogFilenamePattern: logs/application-%d.log.gz
      archivedFileCount: 5
```

## Scaling and Performance

### Horizontal Scaling

#### ECS Service Scaling
```bash
# Update service desired count
aws ecs update-service \
  --cluster hackathon-game-cluster \
  --service hackathon-server-service \
  --desired-count 4
```

#### Auto Scaling Configuration
```hcl
resource "aws_appautoscaling_target" "ecs_target" {
  max_capacity       = 10
  min_capacity       = 2
  resource_id        = "service/hackathon-game-cluster/hackathon-server-service"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "scale_up" {
  name               = "scale-up"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
  }
}
```

### Database Scaling

#### Read Replicas
```hcl
resource "aws_db_instance" "read_replica" {
  identifier             = "hackathon-db-read-replica"
  replicate_source_db    = aws_db_instance.main.id
  instance_class         = "db.t3.medium"
  publicly_accessible    = false
  auto_minor_version_upgrade = false
}
```

#### Connection Pooling
```yaml
database:
  # ... other settings ...
  properties:
    hibernate.connection.provider_class: com.zaxxer.hikari.hibernate.HikariConnectionProvider
    hibernate.hikari.maximumPoolSize: 20
    hibernate.hikari.minimumIdle: 5
    hibernate.hikari.connectionTimeout: 30000
```

## Backup and Recovery

### Database Backups
```bash
# Automated backups (configured in Terraform)
backup_retention_period = 7
backup_window = "03:00-04:00"
maintenance_window = "sun:04:00-sun:05:00"

# Manual backup
aws rds create-db-snapshot \
  --db-instance-identifier hackathon-db \
  --db-snapshot-identifier hackathon-db-snapshot-$(date +%Y%m%d)
```

### Application Data Backup
```bash
# Backup game data
kubectl exec -it <server-pod> -- pg_dump -h <db-host> -U <db-user> hackathon_game > backup.sql

# Backup configuration
tar -czf config-backup.tar.gz server/server.yml ui/.env deployment/terraform.tfvars
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connectivity
telnet <db-host> 5432

# Verify credentials
psql -h <db-host> -U <db-user> -d hackathon_game

# Check security groups
aws ec2 describe-security-groups --group-ids <sg-id>
```

#### Container Issues
```bash
# Check ECS service status
aws ecs describe-services --cluster <cluster-name> --services <service-name>

# View container logs
aws logs get-log-events --log-group-name /ecs/hackathon-server --log-stream-name <stream-name>

# Debug container
aws ecs execute-command --cluster <cluster> --task <task-id> --container server --interactive --command "/bin/bash"
```

#### Load Balancer Issues
```bash
# Check target health
aws elbv2 describe-target-health --target-group-arn <target-group-arn>

# View load balancer logs
aws s3 cp s3://<alb-logs-bucket>/AWSLogs/<account-id>/elasticloadbalancing/<region>/ . --recursive
```

### Performance Monitoring
```bash
# Monitor ECS metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --dimensions Name=ServiceName,Value=hackathon-server-service \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-01T23:59:59Z \
  --period 3600 \
  --statistics Average
```

## Security Considerations

### Network Security
- VPC with private subnets for database and application
- Security groups with minimal required access
- WAF rules for web application protection

### Application Security
- Regular security updates for base images
- Secrets management using AWS Secrets Manager
- IAM roles with least privilege access

### Data Protection
- Encryption at rest for database and storage
- Encryption in transit with TLS/SSL
- Regular security audits and penetration testing

## Cost Optimization

### Resource Right-Sizing
- Monitor CloudWatch metrics to optimize instance sizes
- Use Spot instances for non-critical workloads
- Implement auto-scaling to match demand

### Storage Optimization
- Use appropriate storage classes for different data types
- Implement lifecycle policies for log retention
- Regular cleanup of unused resources

### Reserved Instances
- Purchase reserved instances for predictable workloads
- Use Savings Plans for flexible compute usage
- Monitor usage patterns for optimization opportunities