class Constants {
    constructor(id, width, height, outOfBoundPositions, spawnPoints) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.outOfBoundPositions = outOfBoundPositions;
        this.spawnPoints = spawnPoints;
    }

    static parse(gameData) {
        let constants = new Constants(
            gameData.id,
            gameData.map.width,
            gameData.map.height,
            gameData.map.outOfBoundPositions,
            gameData.spawnPoints
        );

        return constants;
    }
}

module.exports = Constants;
