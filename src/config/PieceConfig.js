import Config from './Config';
import MovePowerConfig from './MovePowerConfig';

export default class PieceConfig extends Config {
    movePowers;
    promotesTo;

    isValid() {
        return Array.isArray(this.movePowers) && this.movePowers.every(e => e instanceof MovePowerConfig && e.isValid()) && typeof this.promotesTo === 'string';
    }
}