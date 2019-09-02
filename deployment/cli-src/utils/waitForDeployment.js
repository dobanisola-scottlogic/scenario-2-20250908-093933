const AWS = require("aws-sdk");
const chalk = require("chalk");

module.exports.waitForCFStatus = async ({ stackname, region, doneStatuses = [], pendingStatues = []}) => {
  process.stdout.write(`Waiting for [${stackname}] to reach ${doneStatuses} `);

  const CloudFormation = new AWS.CloudFormation({ region });

  await new Promise(async (res, rej) => {
    const interval = setInterval(async () => {
      let stack;
      try {
        stack = await CloudFormation.describeStacks({
          StackName: stackname
        }).promise();
      } catch (e) {
        console.error(chalk.red(`Could not find stack [${stackname}]`));
        clearInterval(interval);
        res();
        return;
      }

      const status = stack.Stacks[0].StackStatus;
      if (doneStatuses.includes(status)) {
        console.log();
        console.log(chalk.green("Done!"));
        clearInterval(interval);
        res();
        return;
      }
      else if (pendingStatues.includes(status)) {
        process.stdout.write(".");
      }
      else {
        console.log();
        console.log(
          chalk.red(
            `There is an issue with the deployment of ${stackname}, check the AWS console`
          )
        );
        clearInterval(interval);
        rej();
        return;
      }
    }, 5000);
  });
};
