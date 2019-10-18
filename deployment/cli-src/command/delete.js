const AWS = require('aws-sdk');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { questionPromptFactory } = require('../utils/question');
const { waitForCFStatus } = require('../utils/waitForDeployment');
const configFile = path.join(__dirname, '.cli-team-config');

module.exports.deleteStacks = async (config) => {
  const {
    region,
    infraStackName,
    serverStackName
  } = config;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const questionPrompt = questionPromptFactory(rl);

  const answer = await questionPrompt('Are you sure you wish to delete the cloud formation stacks [yes/no] (no)> ');
  if (answer !== 'yes') {
    console.log('Aborting delete');
    return;
  }

  const CloudFormation = new AWS.CloudFormation({ region });

  await CloudFormation.deleteStack({ StackName: serverStackName }).promise();
  await waitForCFStatus({
    stackname: serverStackName,
    region,
    doneStatuses: [ 'DELETE_COMPLETE' ],
    pendingStatues: [ 'DELETE_IN_PROGRESS' ]
  });

  await CloudFormation.deleteStack({ StackName: infraStackName }).promise();
  await waitForCFStatus({
    stackname: infraStackName,
    region,
    doneStatuses: [ 'DELETE_COMPLETE' ],
    pendingStatues: [ 'DELETE_IN_PROGRESS' ]
  });

  rl.close();
  deleteTeamsConfig()
};

function deleteTeamsConfig(config) {
  fs.unlink(configFile, (err) => {
    if (err) {
      console.log("failed to delete cli-team-config" +  err);
    } else {
      console.log('successfully deleted cli-team-config');
    }
  });
}
