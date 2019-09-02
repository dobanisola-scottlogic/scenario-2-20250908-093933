# CLI Tool

This tool can be used to deploy the hackathon into AWS.

## Prerequisits
- Both of the docker images (i.e. the server image and the contestant VSCode image) must be already pushed into ECR
- The AWS CLI has been setup on the command line, see the [setup guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
- Your account in AWS has the correct permissions to deploy the resources
- npm/node is installed on your machine

## Building
Before running the cli, run
```bash
npm i
```

## Usage
### Configuration
**Configure**

To configure the cli, creates a `.cli-config` file to save config between runs
```bash
./cli configure
```
And follow the prompts given

---

**Deploy**

To deploy the 2 CloudFormation templates
```bash
./deploy
```

---

**Create Team**

To create a new team in the hackathon
```bash
./cli create-team -t <my teamname>
```
Will print the public DNS of the teams instance

---
**Delete Team**

To delete an existing team in the hackathon
```bash
./cli delete-team -t <my teamname>
```
---

**Delete Stack**

To delete both of the CloudFormation stacks
```bash
./cli delete
```
