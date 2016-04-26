
let PHASER = require('../../enums/phaser.js');
let SPRITE = require('../../enums/sprite.js');

let Cell = require('./Cell.js');

class Collectable {
    constructor(game, id, type, cell) {
        this.id = id;
        this.type = type;
        this.cell = cell.clone();
        this.sprite = this.constructSprite(game);
    }
    constructSprite(game) {
        let sprite = game.add.sprite((this.cell.column + 0.5) * PHASER.CELL.WIDTH,
                                       (this.cell.row + 0.5) * PHASER.CELL.HEIGHT,
                                       SPRITE.COLLECTABLE.IDENTIFIER,
                                       0);
        sprite.width = PHASER.CELL.WIDTH;
        sprite.height = PHASER.CELL.HEIGHT;
        sprite.anchor.setTo(0.5, 0.5);
        return sprite;
    }
    destroy() {
        this.sprite.destroy();
    }
}

module.exports = Collectable;
