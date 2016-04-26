var Cell = require('../engine/models/Cell');
var states = [];

class State {
    constructor(players, collectables, spawnPoints) {
        this.players = players;
        this.collectables = collectables;
        this.spawnPoints = spawnPoints;
    }

    static parse(phase, gameData) {
        let state = new State(
            parsePlayerPositions(phase, gameData),
            parseCollectablePositions(phase, gameData),
            parseSpawnPositions(phase, gameData)
        );

        return state;
    }

    static parseEnumerable(gameData) {
        for (let i = 0; i < gameData.phaseResults.length; i++) {
            let state = new State(
                parsePlayerPositions(i, gameData),
                parseCollectablePositions(i, gameData),
                parseSpawnPositions(i, gameData)
            );

            states.push(state);
        }

        return states;
    }
}

function parsePlayerPositions(index, gameData) {
    let players = [];
    gameData.phaseResults[index].playerPositions.forEach((player) => {
        players.push({
            id: player.id,
            cell: new Cell(player.position.x, player.position.y)
        });
    });

    return players;
}

function parseCollectablePositions(index, gameData) {
    let collectables = [];

    // Set current collectables to previous collectables
    if (index > 0) {
        states[index - 1].collectables.forEach((collectable) => {
            collectables.push(collectable);
        });
    }

    // Add new collectables
    gameData.phaseResults[index].addedCollectables.forEach((addedCollectable) => {
        collectables.push({
            id: addedCollectable.id,
            type: addedCollectable.type,
            cell: new Cell(addedCollectable.position.x, addedCollectable.position.y)
        });
    });

    // Remove collected collectables
    gameData.phaseResults[index].removedCollectables.forEach((removedCollectable) => {
        let idIndex = collectables.map(collectable => collectable.id).indexOf(removedCollectable);

        if (idIndex !== -1) {
            collectables.splice(idIndex, 1);
        } else {
            console.log('Tried to remove a collectable that did not exist with id', removedCollectable);
        }
    });

    return collectables;
}

function parseSpawnPositions(index, gameData) {
    let spawnPoints = [];

    // Set the current spawn points to the previous spawn point
    if (index === 0) {
        gameData.spawnPoints.forEach((spawnPoint) => {
            spawnPoints.push({
                id: spawnPoint.id,
                owner: spawnPoint.owner,
                cell: new Cell(spawnPoint.position.x, spawnPoint.position.y)
            });
        });
    } else {
        states[index - 1].spawnPoints.forEach((spawnPoint) => {
            spawnPoints.push(spawnPoint);
        });
    }

    // Remove any destroyed spawn points
    gameData.phaseResults[index].removedSpawnPoints.forEach((removedSpawnPoint) => {
        let idIndex = spawnPoints.map(spawn => spawn.id).indexOf(removedSpawnPoint);

        if (idIndex !== -1) {
            spawnPoints.splice(idIndex, 1);
        } else {
            console.log('Tried to remove a spawn point that did not exist with id', removedSpawnPoint);
        }
    });

    return spawnPoints;
}

module.exports = State;
