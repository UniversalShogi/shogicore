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

    isProtecting(src, dst) {
        if (src.every((e, i) => dst[i] === e))
            return false;
        let srcSquare = this.getSquareAt(src[0], src[1]);
        if (!srcSquare.isOccupied())
            return false;
        let moving = srcSquare.getOccupyingPiece();
        let owner = moving.getOwner();

        function checkLion(way, dir, depth) {
            let tmp, tmpSquare;

            if (dir === Direction8.K) {
                for (let first of Direction8.STANDARD) {
                    tmp = new MoveAction(null, way, power, first).calculateDestination(owner);
                    if (!this.has(tmp[0], tmp[1]))
                        continue;
                    tmpSquare = this.getSquareAt(tmp[0], tmp[1]);
                    if (tmp.every((e, i) => dst[i] === e))
                        return true;
                    else if (depth > 0 && (!tmpSquare.isOccupied() || tmpSquare.getOccupyingPiece().getOwner() !== owner))
                        if (checkLion(tmp, dir, depth - 1))
                            return true;
                }
            } else {
                tmp = new MoveAction(null, way, power, dir).calculateDestination(owner);
                if (!this.has(tmp[0], tmp[1]))
                    return false;
                tmpSquare = this.getSquareAt(tmp[0], tmp[1]);
                if (tmp.every((e, i) => dst[i] === e))
                    return true;
                else if (depth > 0 && (!tmpSquare.isOccupied() || tmpSquare.getOccupyingPiece().getOwner() !== owner))
                    if (checkLion(tmp, dir, depth - 1))
                        return true;
            }

            return false;
        }

        function checkSLion(way, dir, depth) {
            let tmp, tmpSquare;

            if (dir === Direction8.K) {
                for (let first of Direction8.STANDARD) {
                    tmp = new MoveAction(null, way, power, first).calculateDestination(owner);
                    if (!this.has(tmp[0], tmp[1]))
                        continue;
                    tmpSquare = this.getSquareAt(tmp[0], tmp[1]);
                    if (tmp.every((e, i) => dst[i] === e))
                        return true;
                    else if (depth > 0 && !tmpSquare.isOccupied())
                        if (checkSLion(tmp, dir, depth - 1))
                            return true;
                }
            } else {
                tmp = new MoveAction(null, way, power, dir).calculateDestination(owner);
                if (!this.has(tmp[0], tmp[1]))
                    return false;
                tmpSquare = this.getSquareAt(tmp[0], tmp[1]);
                if (tmp.every((e, i) => dst[i] === e))
                    return true;
                else if (depth > 0 && !tmpSquare.isOccupied())
                    if (checkSLion(tmp, dir, depth - 1))
                        return true;
            }

            return false;
        }

        function checkHook(way, dir, depth) {
            let tmp, tmpSquare;

            for (let first of dir === Direction8.R ? Direction8.ROOK : Direction8.BISHOP) {
                for (let i = 1; i < this.#width || i < this.#height; i++) {
                    tmp = new MoveAction(null, way, power, first, i).calculateDestination(owner);

                    if (!this.has(tmp[0], tmp[1]))
                        break;
                    tmpSquare = this.getSquareAt(tmp[0], tmp[1]);
                    if (depth > 0 && (!tmpSquare.isOccupied() || tmpSquare.getOccupyingPiece().getOwner() !== owner))
                        if (checkHook(tmp, dir, depth - 1))
                            return true;
                    if (tmpSquare.isOccupied())
                        break;
                }
            }

            return false;
        }

        function checkSHook(way, dir, depth) {
            let tmp, tmpSquare;

            for (let first of dir === Direction8.R ? Direction8.ROOK : Direction8.BISHOP) {
                for (let i = 1; i < this.#width || i < this.#height; i++) {
                    tmp = new MoveAction(null, way, power, first, i).calculateDestination(owner);

                    if (!this.has(tmp[0], tmp[1]))
                        break;
                    tmpSquare = this.getSquareAt(tmp[0], tmp[1]);
                    if (tmpSquare.isOccupied())
                        break;
                    if (depth > 0 && checkSHook(tmp, dir, depth - 1))
                        return true;
                    
                }
            }

            return false;
        }
        
        for (let [power, direction] of moving.getMovePowers()) {
            switch (power) {
                case Movement.STEP:
                case Movement.DOUBLE:
                case Movement.GENERALSTEP:
                    if (new MoveAction(null, src, power, direction)
                        .calculateDestination(owner).every((e, i) => dst[i] === e))
                        return true;
                    break;
                
                case Movement.RANGE: {
                    for (let i = 1; i < this.#width || i < this.#height; i++) {
                        let way = new MoveAction(null, src, power, direction, i).calculateDestination(owner);

                        if (this.has(way[0], way[1]))
                            if (way.every((e, i) => dst[i] === e))
                                return true;
                            else if (this.getSquareAt(way[0], way[1]).isOccupied())
                                break;
                    }

                    break;
                }

                case Movement.LION: {
                    if (checkLion(src, direction, 1))
                        return true;
                    break;
                }

                case Movement.SLION: {
                    if (checkSLion(src, direction, 1))
                        return true;
                    break;
                }

                case Movement.LION3: {
                    if (checkLion(src, direction, 2))
                        return true;
                    break;
                }

                case Movement.SLION3: {
                    if (checkSLion(src, direction, 2))
                        return true;
                    break;
                }

                case Movement.HOOK: {
                    if (checkHook(src, direction, 1))
                        return true;
                    break;
                }

                case Movement.SHOOK: {
                    if (checkSHook(src, direction, 1))
                        return true;
                    break;
                }

                case Movement.EMPEROR: {
                    return true;
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

    isAttacking(dst, owner) {
        for (let i = 0; i < this.#height; i++)
            for (let j = 0; j < this.#width; j++) {
                let srcSquare = this.getSquareAt(i, j);
                if (!srcSquare.isOccupied())
                    continue;
                let piece = srcSquare.getOccupyingPiece();
                if (piece.getOccupyingPiece() === owner && this.isProtecting([i, j], dst)
                    && (!piece.noSuicide() || !this.isProtectedBy(dst, 1 - owner)))
                    return true;
            }
        return false;
    }

    getRoyalCount(owner) {
        let ctr = 0;

        for (let i = 0; i < this.#height; i++)
            for (let j = 0; j < this.#width; j++) {
                let src = this.getSquareAt(i, j);
                if (src.isOccupied() && src.getOccupyingPiece().getOwner() === owner && src.getOccupyingPiece().isKing())
                    ctr++;
            }
        return ctr;
    }

    hasUniqueRoyal(owner) {
        return this.getRoyalCount(owner) === 1;
    }

    getFirstRoyalLocation(owner) {
        for (let i = 0; i < this.#height; i++)
            for (let j = 0; j < this.#width; j++) {
                let src = this.getSquareAt(i, j);
                if (src.isOccupied() && src.getOccupyingPiece().getOwner() === owner && src.getOccupyingPiece().isKing())
                    return src;
            }
        return [-1, -1];
    }

    royalElliminated(owner) {
        return this.getRoyalCount(owner) === 0;
    }

    getSquareAt(row, column) {
        return this.#squares[row][column];
    }

    setSquareAt(row, column, square) {
        this.#squares[row][column] = square;
    }
}