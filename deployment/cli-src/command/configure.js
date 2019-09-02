const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { questionPromptFactory } = require('../utils/question');

const configFile = path.join(__dirname, '.cli-config');

const configDefaults = {
    region: 'eu-west-2',
    serverServiceName: 'hackathon-server',
    serverHttpPort: '8080',
    serverCpu: '4096',
    serverMemory: '8192',
    dbName: 'hackathon',
    dbUser: 'hackathon'
}

const configPrompt = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        const questionPrompt = questionPromptFactory(rl);

        const region = await questionPrompt('region (eu-west-2)> ');
        const infraStackName = await questionPrompt('Infrastructure Stack Name> ');
        const serverStackName = await questionPrompt('Server Stack Name> ');
        const serverServiceName = await questionPrompt('ECS Service Name (hackathon-server)> ');
        const serverHttpPort = await questionPrompt('Server HTTP Port (8080)> ');
        const serverCpu = await questionPrompt('CPU (4096)> ');
        const serverMemory = await questionPrompt('Memory (8192)> ');
        const dbName = await questionPrompt('Database Name (hackathon)> ');
        const dbUser = await questionPrompt('Database User (hackathon)> ');
        const dbPassword = await questionPrompt('Database Password (8 characters min)> ');
        const serverImage = await questionPrompt('Server Image(hackathon-gameserver) URI> ');
        const clientImage = await questionPrompt('Client Image(hackathon-contestant)  URI> ');
        const creator = await questionPrompt('Creator [used for tagging]> ');

        return Object.assign({}, {
            region,
            infraStackName,
            serverStackName,
            serverServiceName,
            serverHttpPort,
            serverCpu,
            serverMemory,
            dbName,
            dbUser,
            dbPassword,
            serverImage,
            clientImage,
            creator
        }, configDefaults);
    } finally {
        rl.close();
    }


}

module.exports = {
    configure: async () => {
        const config = await configPrompt();
        fs.writeFileSync(configFile, JSON.stringify(config));
        return config;
    },
    readSavedConfig: () => {
        try {
            if (fs.existsSync(configFile)) {
                const config = JSON.parse(fs.readFileSync(configFile));
                console.log('Found saved config');
                return config;
            }
        } catch (e) {}

        return {};
    }
};
