class Cell {
    constructor(column, row) {
        this.column = column;
        this.row = row;
    }
    clone() {
        return new Cell(this.column, this.row);
    }
}

module.exports = Cell;
