import Config from './Config.js';
import SquareConfig from './SquareConfig.js';

export default class BoardConfig extends Config {
    width;
    height;
    initialSquares;

    isValid() {
        return Number.isInteger(this.width) && this.width > 0
            && Number.isInteger(this.height) && this.height > 0
            && Array.isArray(this.initialPieces) && this.initialPieces.length == this.width
            && this.initialPieces.every(e => Array.isArray(e) && e.length == this.height && e.every(e1 => e1 instanceof SquareConfig && e1.isValid()));
    }
}