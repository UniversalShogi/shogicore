import Direction8 from '../game/movement/Direction8.js';
import Movement from '../game/movement/Movement.js';
import Config from './Config.js';

export default class MovePowerConfig extends Config {
    movement;
    direction;
    
    isValid() {
        if (!Number.isInteger(this.movement) || !Number.isInteger(this.direction))
            return false;
        switch (this.movement) {
            case Movement.STEP:
            case Movement.RANGE:
                if (direction === Direction8.K)
                    return false;
            case Movement.LION:
                return Object.values(Direction8).includes(this.direction) && direction !== Direction8.P;
            case Movement.DOUBLE:
                return Object.values(Direction16).includes(this.direction);
            default:
                return false;
        }
    }
}