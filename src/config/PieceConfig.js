import Config from './Config';

export default class PieceConfig extends Config {
    movePower;
    promotesTo;

    isValid() {
        return typeof this.movePower === 'string' && typeof this.promotesTo === 'string';
    }
}