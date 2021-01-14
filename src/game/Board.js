import MoveAction from './action/MoveAction.js';
import Direction8 from './movement/Direction8.js';
import Movement from './movement/Movement.js';
import Square from './Square.js';

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

    has(row, column) {
        return Number.isInteger(row) && row >= 0 && row < this.#height && Number.isInteger(column) && column >= 0 && column < this.#width;
    }

    isGodProtecting(src, dst) {
        let srcSquare = this.getSquareAt(src[0], src[1]);
        if (!srcSquare.isOccupied())
            return false;
        let moving = srcSquare.getOccupyingPiece();
        let owner = moving.getOwner();
        
        for (let [power, direction] of moving.getMovePowers()) {
            switch (power) {
                case Movement.STEP:
                case Movement.DOUBLE:
                    if (new MoveAction(null, src, power, direction)
                        .calculateDestination(owner).every((e, i) => dst[i] === e))
                        return true;
                    break;
                
                case Movement.RANGE: {
                    for (let i = 1; i < this.#width || i < this.#height; i++) {
                        let way = new MoveAction(null, src, power, direction, false, 0, 0, i).calculateDestination(owner);

                        if (this.has(way[0], way[1]))
                            if (way.every((e, i) => dst[i] === e))
                                return true;
                    }

                    break;
                }

                case Movement.LION: {
                    let way, waySquare;

                    if (direction === Direction8.K) {
                        for (let first of Direction8.STANDARD) {
                            way = new MoveAction(null, src, power, first).calculateDestination(owner);
                            if (!this.has(way[0], way[1]))
                                continue;
                            waySquare = this.getSquareAt(way[0], way[1]);
                            if (way.every((e, i) => dst[i] === e))
                                return true;
                            for (let second of Direction8.STANDARD)
                                if (new MoveAction(null, way, power, second).calculateDestination(owner).every((e, i) => dst[i] === e))
                                    return true;
                        }
                    } else {
                        way = new MoveAction(null, src, power, direction).calculateDestination(owner);
                        if (!this.has(way[0], way[1]))
                            continue;
                        waySquare = this.getSquareAt(way[0], way[1]);
                        if (way.every((e, i) => dst[i] === e))
                            return true;
                        if (new MoveAction(null, way, power, direction).calculateDestination(owner).every((e, i) => dst[i] === e))
                                return true;
                    }

                    break;
                }

                default:
                    break;
            }
        }

        return false;
    }

    isStuck(src) {
        for (let i = 0; i < this.#height; i++)
            for (let j = 0; j < this.#width; j++)
                if (this.isGodProtecting(src, [i, j]))
                    return false;

        return true;
    }

    isProtecting(src, dst) {
        if (src.every((e, i) => dst[i] === e))
            return false;
        let srcSquare = this.getSquareAt(src[0], src[1]);
        if (!srcSquare.isOccupied())
            return false;
        let moving = srcSquare.getOccupyingPiece();
        let owner = moving.getOwner();
        
        for (let [power, direction] of moving.getMovePowers()) {
            switch (power) {
                case Movement.STEP:
                case Movement.DOUBLE:
                    if (new MoveAction(null, src, power, direction)
                        .calculateDestination(owner).every((e, i) => dst[i] === e))
                        return true;
                    break;
                
                case Movement.RANGE: {
                    for (let i = 1; i < this.#width || i < this.#height; i++) {
                        let way = new MoveAction(null, src, power, direction, false, 0, 0, i).calculateDestination(owner);

                        if (this.has(way[0], way[1]))
                            if (way.every((e, i) => dst[i] === e))
                                return true;
                            else if (this.getSquareAt(way[0], way[1]).isOccupied())
                                break;
                    }

                    break;
                }

                case Movement.LION: {
                    let way, waySquare;

                    if (direction === Direction8.K) {
                        for (let first of Direction8.STANDARD) {
                            way = new MoveAction(null, src, power, first).calculateDestination(owner);
                            if (!this.has(way[0], way[1]))
                                continue;
                            waySquare = this.getSquareAt(way[0], way[1]);
                            if (way.every((e, i) => dst[i] === e))
                                return true;
                            else if (!waySquare.isOccupied() || waySquare.getOccupyingPiece().getOwner() !== owner)
                                for (let second of Direction8.STANDARD)
                                    if (new MoveAction(null, way, power, second).calculateDestination(owner).every((e, i) => dst[i] === e))
                                        return true;
                        }
                    } else {
                        way = new MoveAction(null, src, power, direction).calculateDestination(owner);
                        if (!this.has(way[0], way[1]))
                            continue;
                        waySquare = this.getSquareAt(way[0], way[1]);
                        if (way.every((e, i) => dst[i] === e))
                            return true;
                        else if (!waySquare.isOccupied() || waySquare.getOccupyingPiece().getOwner() !== owner)
                            if (new MoveAction(null, way, power, direction).calculateDestination(owner).every((e, i) => dst[i] === e))
                                return true;
                    }

                    break;
                }

                default:
                    break;
            }
        }

        return false;
    }

    isProtectedBy(dst, owner) {
        for (let i = 0; i < this.#height; i++)
            for (let j = 0; j < this.#width; j++) {
                let srcSquare = this.getSquareAt(i, j);
                if (srcSquare.isOccupied() && srcSquare.getOccupyingPiece().getOwner() === owner
                    && this.isProtecting([i, j], dst))
                    return true;
            }
        return false;
    }

    getSquareAt(row, column) {
        return this.#squares[row][column];
    }

    setSquareAt(row, column, square) {
        this.#squares[row][column] = square;
    }
}