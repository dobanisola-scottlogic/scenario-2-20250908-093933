var movement = require('../enums/movement');
var Cell = require('../engine/models/Cell');

let spawnPoints = [];

class Delta {
    constructor(playerMovement, playersAdded, playersDestroyed, collectablesCollected, collectablesAdded, spawnPointsDestroyed) {
        this.playerMovement = playerMovement;
        this.playersAdded = playersAdded;
        this.playersDestroyed = playersDestroyed;
        this.collectablesCollected = collectablesCollected;
        this.collectablesAdded = collectablesAdded;
        this.spawnPointsDestroyed = spawnPointsDestroyed;
    }

    static parse(phase, gameData) {

        initialiseSpawnPoints(gameData);

        let delta = new Delta(
            parsePlayerMovement(phase, gameData),
            parsePlayersAdded(phase, gameData),
            parsePlayersDestroyed(phase, gameData),
            parseCollectablesCollected(phase, gameData),
            parseCollectablesAdded(phase, gameData),
            parseSpawnPointDestroys(phase, gameData)
        );

        return delta;
    }

    static parseEnumerable(gameData) {
        let deltas = [];

        initialiseSpawnPoints(gameData);

        for (let i = 0; i < gameData.phaseResults.length; i++) {
            let delta = new Delta(
                parsePlayerMovement(i, gameData),
                parsePlayersAdded(i, gameData),
                parsePlayersDestroyed(i, gameData),
                parseCollectablesCollected(i, gameData),
                parseCollectablesAdded(i, gameData),
                parseSpawnPointDestroys(i, gameData)
            );

            deltas.push(delta);
        }

        return deltas;
    }
}

function initialiseSpawnPoints(gameData) {
    gameData.spawnPoints.forEach((spawnPoint, spawnIndex) => {
        spawnPoints.push({
            id: spawnPoint.id,
            owner: spawnPoint.owner,
            cell: new Cell(spawnPoint.position.x, spawnPoint.position.y),
            teamIndex: spawnIndex
        });
    });
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

            // Handle the wrapping of the map
            xMovement = xMovement > 1 ? -1 : xMovement;
            xMovement = xMovement < -1 ? 1 : xMovement;
            yMovement = yMovement > 1 ? -1 : yMovement;
            yMovement = yMovement < -1 ? 1 : yMovement;

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
        if (yMovement === -1) {
            movementDirection = movement.NORTHEAST;
        } else if (yMovement === 0) {
            movementDirection = movement.EAST;
        } else if (yMovement === 1) {
            movementDirection = movement.SOUTHEAST;
        }
    } else if (xMovement === 0) {
        if (yMovement === -1) {
            movementDirection = movement.NORTH;
        } else if (yMovement === 0) {
            movementDirection = movement.STATIONARY;
        } else if (yMovement === 1) {
            movementDirection = movement.SOUTH;
        }
    } else if (xMovement === -1) {
        if (yMovement === -1) {
            movementDirection = movement.NORTHWEST;
        } else if (yMovement === 0) {
            movementDirection = movement.WEST;
        } else if (yMovement === 1) {
            movementDirection = movement.SOUTHWEST;
        }
    }

    return movementDirection;
}

function parsePlayersAdded(index, gameData) {
    let playersAdded = [];
    let previousPlayers = [];

    if (index > 0) {
        previousPlayers = gameData.phaseResults[index - 1].playerPositions.map(playerPosition => playerPosition.id);
    }

    gameData.phaseResults[index].playerPositions.forEach(player => {
        if (index === 0 || previousPlayers.indexOf(player.id) === -1) {
            let teamIndex = -1;
            let addedPlayerIndex = gameData.phaseResults[index].addedPlayers.map(addedPlayer => addedPlayer.id)
                                                                            .indexOf(player.id);
            let owner = gameData.phaseResults[index].addedPlayers[addedPlayerIndex].owner || null;

            spawnPoints.forEach(spawnPoint => {
                if (spawnPoint.owner === owner) {
                    teamIndex = spawnPoint.teamIndex;
                }
            });

            playersAdded.push({
                id: player.id,
                cell: new Cell(player.position.x, player.position.y),
                owner: owner,
                teamIndex: teamIndex
            });
        }
    });

    return playersAdded;
}

function parsePlayersDestroyed(index, gameData) {
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
        collectablesAdded.push({
            id: addedCollectable.id,
            type: addedCollectable.type,
            cell: new Cell(addedCollectable.position.x, addedCollectable.position.y)
        });
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
