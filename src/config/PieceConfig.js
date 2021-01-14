import Config from './Config.js';
import MovePowerConfig from './MovePowerConfig.js';

export default class PieceConfig extends Config {
    movePowers;
    promotesTo;
    isKing;

    constructor(movePowers, promotesTo = '', isKing = false) {
        super();
        this.movePowers = movePowers;
        this.promotesTo = promotesTo;
        this.isKing = isKing;
    }

    isValid() {
        return Array.isArray(this.movePowers) && this.movePowers.every(e => e instanceof MovePowerConfig && e.isValid())
            && typeof this.promotesTo === 'string' && typeof this.isKing === 'boolean';
    }
}