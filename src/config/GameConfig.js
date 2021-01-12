import BetzaUtils from '../utils/BetzaUtils';
import BoardConfig from './BoardConfig';
import Config from './Config';

export default class GameConfig extends Config {
    piecePool;
    boardConfig;
    participantCount;
    dropsEnabled;
    // promotion rules
    // special rules

    isValid() {
        return this.piecePool instanceof Map && [...this.piecePool.keys()].every(k => typeof k === 'string' && BetzaUtils.isValid(this.piecePool.get(k)))
            && this.boardConfig instanceof BoardConfig && this.boardConfig.isValid()
            && this.boardConfig.initialSquares.every(e => e.every(e1 => this.piecePool.has(e1.name)))
            && Number.isInteger(this.participantCount) && this.participantCount > 0
            && typeof this.dropsEnabled === 'boolean';
    }
}