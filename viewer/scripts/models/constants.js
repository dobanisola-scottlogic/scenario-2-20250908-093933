var Cell = require('../engine/models/Cell');

class Constants {
    constructor(id, width, height, outOfBoundPositions, spawnPoints, owners, teamInfo) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.outOfBoundPositions = outOfBoundPositions;
        this.spawnPoints = spawnPoints;
        this.owners = owners;
        this.teamInfo = teamInfo;
    }

    static parse(gameData) {
        let owners = [];
        let spawnPoints = [];
        let teamInfo = [];

        gameData.spawnPoints.forEach((spawnPoint, index) => {
            owners.push(spawnPoint.owner);
            spawnPoints.push({
                id: spawnPoint.id,
                owner: spawnPoint.owner,
                cell: new Cell(spawnPoint.position.x, spawnPoint.position.y),
                teamIndex: index
            });
        });

        gameData.game.teamBots.forEach(team => {
            teamInfo.push(team);
        });

        let constants = new Constants(
            gameData.id,
            gameData.game.map.width,
            gameData.game.map.height,
            gameData.game.map.outOfBoundPositions,
            spawnPoints,
            owners,
            teamInfo
        );

        return constants;
    }
}

module.exports = Constants;
