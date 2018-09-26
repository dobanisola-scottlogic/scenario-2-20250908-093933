
let MOVEMENT = require('../../enums/movement');

class CellShifter {
    constructor() { }
    getCellShift(movement) {
        return {
            columnShift: this.getColumnShift(movement),
            rowShift: this.getRowShift(movement)
        };
    }
    getRowShift(movement) {
        let rowShift = 0;
        if ([MOVEMENT.NORTH, MOVEMENT.NORTHEAST, MOVEMENT.NORTHWEST].indexOf(movement) !== -1) { rowShift = -1; }
        else if ([MOVEMENT.SOUTHEAST, MOVEMENT.SOUTH, MOVEMENT.SOUTHWEST].indexOf(movement) !== -1) { rowShift = 1; }

        return rowShift;
    }
    getColumnShift(movement) {
        let columnShift = 0;
        if ([MOVEMENT.NORTHEAST, MOVEMENT.EAST, MOVEMENT.SOUTHEAST].indexOf(movement) !== -1) { columnShift = 1; }
        else if ([MOVEMENT.SOUTHWEST, MOVEMENT.WEST, MOVEMENT.NORTHWEST].indexOf(movement) !== -1) { columnShift = -1; }

        return columnShift;
    }
    wrap(desiredPosition, maximumPosition) {
        return ((desiredPosition % maximumPosition) + maximumPosition) % maximumPosition;
    }
}

module.exports = new CellShifter();
