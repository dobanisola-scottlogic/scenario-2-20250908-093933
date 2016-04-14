var movement = require('../enums/movement');

class Delta {
    constructor(playerMovement, playersDestroyed, collectablesCollected, collectablesAdded, spawnPointsDestroyed) {
        this.playerMovement = playerMovement;
        this.playersDestroyed = playersDestroyed;
        this.collectablesCollected = collectablesCollected;
        this.collectablesAdded = collectablesAdded;
        this.spawnPointsDestroyed = spawnPointsDestroyed;
    }

    static parse(phase, gameData) {
        let delta = new Delta(
            parsePlayerMovement(phase, gameData),
            parsePlayersDestroys(phase, gameData),
            parseCollectablesCollected(phase, gameData),
            parseCollectablesAdded(phase, gameData),
            parseSpawnPointDestroys(phase, gameData)
        );

        return delta;
    }

    static parseEnumerable(gameData) {
        let deltas = [];

        for (let i = 0; i < gameData.phaseResults.length; i++) {
            let delta = new Delta(
                parsePlayerMovement(i, gameData),
                parsePlayersDestroys(i, gameData),
                parseCollectablesCollected(i, gameData),
                parseCollectablesAdded(i, gameData),
                parseSpawnPointDestroys(i, gameData)
            );

            deltas.push(delta);
        }

        return deltas;
    }
}

function parsePlayerMovement(index, gameData) {
    let playerMovement = [];
    gameData.phaseResults[index].playerPositions.forEach((playerPosition) => {
        let idIndex = -1;
        // If index = 0, every player should be treated as a spawn
        if (index !== 0) {
            idIndex = gameData.phaseResults[index - 1].playerPositions.map(player => player.id).indexOf(playerPosition.id);
        }

        if (idIndex === -1) {
            playerMovement.push({
                id: playerPosition.id,
                movement: movement.STATIONARY
            });
        } else {
            let xMovement = playerPosition.position.x - gameData.phaseResults[index - 1].playerPositions[idIndex].position.x;
            let yMovement = playerPosition.position.y - gameData.phaseResults[index - 1].playerPositions[idIndex].position.y;

            playerMovement.push({
                id: playerPosition.id,
                movement: calculatePlayerMovement(xMovement, yMovement)
            });
        }
    });

    return playerMovement;
}

function calculatePlayerMovement(xMovement, yMovement) {
    let movementDirection = movement.STATIONARY;
    if (xMovement === 1) {
        if (yMovement === 1) {
            movementDirection = movement.NORTHEAST;
        } else if (yMovement === 0) {
            movementDirection = movement.EAST;
        } else if (yMovement === -1) {
            movementDirection = movement.SOUTHEAST;
        }
    } else if (xMovement === 0) {
        if (yMovement === 1) {
            movementDirection = movement.NORTH;
        } else if (yMovement === 0) {
            movementDirection = movement.STATIONARY;
        } else if (yMovement === -1) {
            movementDirection = movement.SOUTH;
        }
    } else if (xMovement === -1) {
        if (yMovement === 1) {
            movementDirection = movement.NORTHWEST;
        } else if (yMovement === 0) {
            movementDirection = movement.WEST;
        } else if (yMovement === -1) {
            movementDirection = movement.SOUTHWEST;
        }
    }

    return movementDirection;
}

function parsePlayersDestroys(index, gameData) {
    let playersDestroyed = [];
    gameData.phaseResults[index].removedPlayers.forEach((removedPlayer) => {
        playersDestroyed.push({
            id: removedPlayer
        });
    });

    return playersDestroyed;
}

function parseCollectablesCollected(index, gameData) {
    let collectablesCollected = [];
    gameData.phaseResults[index].removedCollectables.forEach((removedCollectable) => {
        collectablesCollected.push({
            id: removedCollectable
        });
    });

    return collectablesCollected;
}

function parseCollectablesAdded(index, gameData) {
    let collectablesAdded = [];
    gameData.phaseResults[index].addedCollectables.forEach((addedCollectable) => {
        collectablesAdded.push(addedCollectable);
    });

    return collectablesAdded;
}

function parseSpawnPointDestroys(index, gameData) {
    let spawnPointsDestroyed = [];
    gameData.phaseResults[index].removedSpawnPoints.forEach((removedSpawnPoint) => {
        spawnPointsDestroyed.push({
            id: removedSpawnPoint
        });
    });

    return spawnPointsDestroyed;
}

module.exports = Delta;
