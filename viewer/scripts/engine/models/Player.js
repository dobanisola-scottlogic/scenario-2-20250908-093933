
let PHASER = require('../../enums/phaser.js');
let SPRITE = require('../../enums/sprite.js');

let Cell = require('./Cell.js');

class Player {
    constructor(game, id, owner, teamIndex, cell) {
        this.id = id;
        this.owner = owner;
        this.teamIndex = teamIndex;
        this.cell = cell.clone();
        this.sprite = this.constructSprite(game);
    }
    constructSprite(game) {
        let sprite = game.add.sprite((this.cell.column + 0.5) * PHASER.CELL.WIDTH,
                                       (this.cell.row + 0.5) * PHASER.CELL.HEIGHT,
                                       SPRITE.PLAYER.IDENTIFIER,
                                       this.teamIndex);
        sprite.width = PHASER.CELL.WIDTH * 0.8;
        sprite.height = PHASER.CELL.HEIGHT * 0.8;
        sprite.anchor.setTo(0.5, 0.5);
        return sprite;
    }
    destroy() {
        this.sprite.destroy();
    }
    setCell(cell) {
        this.cell = cell;
        this.sprite.x = (this.cell.column + 0.5) * PHASER.CELL.WIDTH;
        this.sprite.y = (this.cell.row + 0.5) * PHASER.CELL.HEIGHT;
    }
}

module.exports = Player;
