import Square from './Square';

export default class Board {
    #width;
    #height;
    #squares;

    constructor(width, height) {
        this.#width = width;
        this.#height = height;
        this.#squares = Array(height).fill().map(() => Array(width).fill().map(() => new Square()));
    }

    getWidth() {
        return this.#width;
    }

    getHeight() {
        return this.#height;
    }

    getSquareAt(row, column) {
        return this.#squares[row][column];
    }

    setSquareAt(row, column, square) {
        this.#squares[row][column] = square;
    }
}