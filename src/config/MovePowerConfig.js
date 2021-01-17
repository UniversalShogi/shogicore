import Direction16 from '../game/movement/Direction16.js';
import Direction8 from '../game/movement/Direction8.js';
import DirectionE from '../game/movement/DirectionE.js';
import DirectionL from '../game/movement/DirectionL.js';
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
            case Movement.CJUMP:
            case Movement.JUMP:
            case Movement.IGUI:
            case Movement.PENETRATE:
                if (Direction8.SPECIAL(this.movement))
                    return false;
            case Movement.LION:
            case Movement.SLION:
            case Movement.LION3:
            case Movement.SLION3:
                return Object.values(Direction8).includes(this.direction) && direction !== Direction8.P;
            case Movement.DOUBLE:
                return Object.values(Direction16).includes(this.direction);
            case Movement.HOOK:
            case Movement.SHOOK:
                return Direction8.SPECIAL(this.movement);
            case Movement.GENERALSTEP:
            case Movement.EMPEROR:
                return this.direction instanceof DirectionE;
            case Movement.LRANGE:
            case Movement.LJUMP:
                return this.direction instanceof DirectionL && Object.values(Direction8).includes(this.direction.direction)
                    && this.direction.from <= this.direction.to;
            default:
                return false;
        }
    }
}