var Cell = require('../engine/models/Cell');

class Constants {
    constructor(id, width, height, outOfBoundPositions, spawnPoints, owners) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.outOfBoundPositions = outOfBoundPositions;
        this.spawnPoints = spawnPoints;
        this.owners = owners;
    }

    static parse(gameData) {
        let owners = [];
        let spawnPoints = [];

        gameData.spawnPoints.forEach((spawnPoint, index) => {
            owners.push(spawnPoint.owner);
            spawnPoints.push({
                id: spawnPoint.id,
                owner: spawnPoint.owner,
                cell: new Cell(spawnPoint.position.x, spawnPoint.position.y),
                teamIndex: index
            });
        });

        let constants = new Constants(
            gameData.id,
            gameData.map.width,
            gameData.map.height,
            gameData.map.outOfBoundPositions,
            spawnPoints,
            owners
        );

        return constants;
    }
}

module.exports = Constants;
