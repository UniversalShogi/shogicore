import CaptureRule from '../game/rule/CaptureRule';
import DropRule from '../game/rule/DropRule';
import PromotionRule from '../game/rule/PromotionRule';
import BoardConfig from './BoardConfig';
import Config from './Config';
import PieceConfig from './PieceConfig';

export default class GameConfig extends Config {
    piecePool;
    boardConfig;
    participantCount;
    captureRule;
    dropRule;
    promotionRule;
    // special rules

    isValid() {
        return this.piecePool instanceof Map && [...this.piecePool.entries()].every(([k, v]) => typeof k === 'string' && k != null
            && v instanceof PieceConfig && v.isValid() && (v.promotesTo == null || this.piecePool.has(v.promotesTo)))
            && this.boardConfig instanceof BoardConfig && this.boardConfig.isValid()
            && this.boardConfig.initialSquares.every(e => e.every(e1 => this.piecePool.has(e1.name) && e1.owner <= this.participantCount && e1.zoneOwner <= this.participantCount))
            && Number.isInteger(this.participantCount) && this.participantCount > 0
            && typeof this.captureRule === 'string' && CaptureRule.isValid(this.captureRule)
            && typeof this.dropRule === 'string' && DropRule.isValid(this.dropRule)
            && typeof this.promotionRule === 'string' && PromotionRule.isValid(this.promotionRule);
    }
}