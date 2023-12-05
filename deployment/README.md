# Deployment

This sub-project contains the scripts and files necessary to deploy the
Hackathon game server.

## AWS Elastic Container Registry (ECR) image deployment

The [push-to-aws.sh](push-to-aws.sh) script in this directory will build the
game server dependencies, create an appropriate Docker image, and push this to
the AWS ECR repository.

Before running the script, you should be signed in to the AWS CLI with
appropriate permissions for this to succeed. 

If you wish to push an image that has a tag other than `latest`, this can be
specified as the first argument to the script. Otherwise, the tag will be
`latest` by default.

---
### N.B. Pushing the `latest` image requires that your local repository is clean (i.e. no uncommitted changes).
---

## Terraform deployment

The resources required to run a Hackathon event can be provisioned using the
Terraform scripts found in
[deployment/src/main/terraform](deployment/src/main/terraform). This includes
the game server (using the ECR image described above), database, and a
pre-configured Cloud9 instance for each team.

Note that it is also still necessary to configure each team via the Hackathon
admin dashboard.

It is preferred to run the Terraform scripts via Gradle, since this will ensure
that dependent sub-projects can be built appropriately for deployment. It is
also possible to run the Terraform scripts directly, but be aware that this will
require manual building of other sub-projects (e.g. Python and Java contestant
archives).

## Docker Compose (deprecated)

This deployment strategy uses Docker compose to deploy the following services to
a single machine:

  - The game server, accessible on port 8080
  - A PostgreSQL database for the game server to use
    
### Advantages

  - Fully automated setup
  - Free if hosted on a local machine
  
### Disadvantages

  - If hosted locally, you must make sure that contestants can access the IP
    address of the machine. Universities often put guests on segregated networks
    that make this impossible.
  - No provisioning of cloud or Internet hosts/resources.
  
### Setup

  1. Install Docker, Docker Compose, and Git on the server machine
  2. Clone this repository onto the server machine
  3. Open a shell in the root of the cloned repository, and run
      ```bash
      docker-compose up
      ```
      
The deployment can be brought down again with `./gradlew down`.
