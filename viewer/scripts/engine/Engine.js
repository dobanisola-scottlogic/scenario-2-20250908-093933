
let PHASER = require('../enums/phaser.js');
let COLOURS = require('../enums/colours.js');

let PhaserPreloader = require('./PhaserPreloader.js');
let PhaserCreator = require('./PhaserCreator.js');
let PhaserRenderer = require('./PhaserRenderer.js');
let PhaserUpdater = require('./PhaserUpdater.js');

let Map = require('./models/Map.js');
let Team = require('./models/Team.js');

// Define engine constructor
class Engine {
    constructor(phaser, gameData) {

        // Save passed values
        this.gameData = gameData;

        // Create phaser method objects
        this.phaserPreloader = new PhaserPreloader(this);
        this.phaserCreator = new PhaserCreator(this);
        this.phaserRenderer = new PhaserRenderer(this);
        this.phaserUpdater = new PhaserUpdater(this);

        // Construct phaser-game engine
        this.game = new phaser.Phaser.Game(
            gameData.constants.width * PHASER.CELL.WIDTH,
            gameData.constants.height * PHASER.CELL.HEIGHT,
            Phaser.AUTO,
            'phaserApp',
            {
                preload: this.phaserPreloader.preload,
                create: this.phaserCreator.create,
                render: this.phaserRenderer.render,
                update: this.phaserUpdater.update
            });

        // Construct map object
        this.map = new Map(this.getColumnCount(), this.getRowCount());

        // Define objects to hold game data
        this.collectables = [];
        this.players = [];
        this.teams = this.createTeams();
        this.paused = false;

    }
    createTeams() {
        let teams = {};

        let colours = [];
        for (let member in COLOURS.TEAM_COLOURS) {
            if (COLOURS.TEAM_COLOURS.hasOwnProperty(member)) {
                colours.push(COLOURS.TEAM_COLOURS[member]);
            }
        }

        this.gameData.constants.teamInfo.forEach((team, index) => {
            teams[team.botId] = new Team(team.teamId, team.teamName, colours[index]);
        });

        return teams;
    }
    getTeamColour(botId) {
        return this.teams[botId].getTeamColour();
    }
    getTeams() {
        return this.teams;
    }
    getPhaseCount() {
        return this.gameData.deltas.length;
    }
    getPhaseDelta(index) {
        return this.gameData.deltas[index];
    }
    getPhaseState(index) {
        return this.gameData.state[index];
    }
    getColumnCount() {
        return this.gameData.constants.width;
    }
    getRowCount() {
        return this.gameData.constants.height;
    }
    getOutOfBoundPositions() {
        return this.gameData.constants.outOfBoundPositions;
    }
    getSpawns() {
        return this.gameData.constants.spawnPoints;
    }
    getCurrentSpawns() {
        return this.map.spawns;
    }
    addSpawns(spawns) {
        this.map.addSpawns(this.game, spawns, this.getOwners());
    }
    destroyAndCleanup() {
        this.game.input.enabled = false;
        this.game.cache.destroy();
        this.game.destroy();
        this.game = null;
    }
    setPaused(paused) {
        this.paused = paused;
        this.phaserUpdater.setPaused(paused);
    }
    isPaused() {
        return this.paused;
    }
}

module.exports = Engine;
