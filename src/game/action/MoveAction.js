import Direction16 from '../movement/Direction16.js';
import Direction8 from '../movement/Direction8.js';
import Movement from '../movement/Movement.js';
import Action from './Action.js';

export default class MoveAction extends Action {
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

    calculateDirection(owner) {
        let x = 0;
        let y = 0;

        function calculateOccurences(str, c) {
            return (str.match(new RegExp(c, 'g')) || []).length;
        }

        switch (this.#movement) {
            case Movement.STEP:
            case Movement.RANGE:
            case Movement.LION:
                x = (this.#direction / 3 >> 0) - 1;
                y = (this.#direction % 3) - 1;

                break;
            case Movement.DOUBLE:
                let real =  Direction16.REAL[this.#direction];
                x = calculateOccurences(real, 'S') - calculateOccurences(real, 'N');
                y = calculateOccurences(real, 'E') - calculateOccurences(real, 'W');
                break;
            default:
        }

        if (owner === 1) {
            x = -x;
            y = -y;
        }

        return [x, y];
    }

    calculateDestination(owner) {
        let [x, y] = this.calculateDirection(owner);

        if (this.#movement === Movement.RANGE) {
            x *= this.#distance;
            y *= this.#distance;
        }

        return [this.#src[0] + x, this.#src[1] + y];
    }
}