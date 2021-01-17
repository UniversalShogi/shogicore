import Config from './Config.js';
import MovePowerConfig from './MovePowerConfig.js';

export default class PieceConfig extends Config {
    movePowers;
    promotesTo;
    isKing;
    generalRank;
    noSuicide;

    constructor(movePowers, promotesTo = '', isKing = false, generalRank = -1, noSuicide = false) {
        super();
        this.movePowers = movePowers;
        this.promotesTo = promotesTo;
        this.isKing = isKing;
        this.generalRank = generalRank;
        this.noSuicide = noSuicide;
    }

    isValid() {
        return Array.isArray(this.movePowers) && this.movePowers.every(e => e instanceof MovePowerConfig && e.isValid())
            && typeof this.promotesTo === 'string' && typeof this.isKing === 'boolean';
    }
}