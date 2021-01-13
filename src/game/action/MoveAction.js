import Direction16 from '../movement/Direction16';
import Direction8 from '../movement/Direction8';
import Movement from '../movement/Movement';
import Action from './Action';

export default class MoveAction extends Action {
    #piece;
    #src;
    #movement;
    #direction;
    #isTerminal;
    #moveCount;
    #previousCaptured;
    #previousDirection;
    #distance;
    #isLionKing;

    constructor(player, src, movement, direction, isTerminal, moveCount, previousCaptured, distance = 1, previousDirection = Direction8.P, isLionKing = false) {
        super(player);
        this.#piece = piece;
        this.#src = src;
        this.#movement = movement;
        this.#direction = direction;
        this.#isTerminal = isTerminal;
        this.#moveCount = moveCount;
        this.#previousCaptured = previousCaptured;
        this.#previousDirection = previousDirection;
        this.#distance = distance;
        this.#isLionKing = isLionKing;
    }

    getPiece() {
        return this.#piece;
    }

    getSource() {
        return this.#src;
    }

    getMovement() {
        return this.#movement;
    }

    getDirection() {
        return this.#direction;
    }

    isTerminal() {
        return this.#isTerminal;
    }

    getMoveCount() {
        return this.#moveCount;
    }

    getPreviousCaptured() {
        return this.#previousCaptured;
    }

    getPreivousDirection() {
        return this.#previousDirection;
    }

    getDistance() {
        return this.#distance;
    }

    isLionKing() {
        return this.#isLionKing;
    }

    calculateDestination(src) {
        let x = 0;
        let y = 0;

        function calculateOccurences(str, c) {
            return (str.match(new RegExp(c, 'g')) || [0]).length;
        }

        switch (this.#movement) {
            case Movement.STEP:
            case Movement.RANGE:
            case Movement.LION:
                x = (this.#direction % 3) - 1;
                y = (this.#direction / 3 >> 0) - 1
                if (this.#movement === Movement.RANGE) {
                    x *= this.#distance;
                    y *= this.#distance;
                }  
                break;
            case Movement.DOUBLE:
                let real =  Direction16.REAL(direction);
                x = calculateOccurences(real, 'E') - calculateOccurences(real, 'W');
                y = calculateOccurences(real, 'N') - calculateOccurences(rela, 'S');
                break;
            default:
        }

        return [src + x, src + y];
    }
}