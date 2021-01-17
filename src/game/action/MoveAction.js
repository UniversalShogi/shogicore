import Direction16 from '../movement/Direction16.js';
import Movement from '../movement/Movement.js';
import Action from './Action.js';

export default class MoveAction extends Action {
    #src;
    #movement;
    #direction;
    #distance;

    constructor(player, src, movement, direction, distance = 1) {
        super(player);
        this.#src = src;
        this.#movement = movement;
        this.#direction = direction;
        this.#distance = distance;
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

    getDistance() {
        return this.#distance;
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
            case Movement.SLION:
            case Movement.LION3:
            case Movement.SLION3:
            case Movement.HOOK:
            case Movement.SHOOK:
            case Movement.CJUMP:
            case Movement.JUMP:
            case Movement.IGUI:
            case Movement.PENETRATE:
                x = (this.#direction / 3 >> 0) - 1;
                y = (this.#direction % 3) - 1;

                break;

            case Movement.LRANGE:
            case Movement.LJUMP:
                x = (this.#direction.direction / 3 >> 0) - 1;
                y = (this.#direction.direction % 3) - 1;

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
        if (this.#movement === Movement.EMPEROR)
            return this.#direction.dst;
        if (this.#movement === Movement.GENERALSTEP)
            return this.#direction.dst.map((e, i) => e + src[i]);
        let [x, y] = this.calculateDirection(owner);

        if (Movement.RANGING(this.#movement)) {
            x *= this.#distance;
            y *= this.#distance;
        }

        return [this.#src[0] + x, this.#src[1] + y];
    }
}