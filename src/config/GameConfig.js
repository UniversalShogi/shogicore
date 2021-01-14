import BoardConfig from './BoardConfig.js';
import Config from './Config.js';
import CaptureRuleConfig from './CaptureRuleConfig.js';
import DropRuleConfig from './DropRuleConfig.js';
import PieceConfig from './PieceConfig.js';
import PromotionRuleConfig from './PromotionRuleConfig.js';

export default class GameConfig extends Config {
    piecePool;
    boardConfig;
    participantCount;
    captureRules;
    dropRules;
    promotionRules;
    // special rules

    isValid() {
        return this.piecePool instanceof Map && [...this.piecePool.entries()].every(([k, v]) => typeof k === 'string' && k != null
            && v instanceof PieceConfig && v.isValid() && (v.promotesTo == null || this.piecePool.has(v.promotesTo)))
            && this.boardConfig instanceof BoardConfig && this.boardConfig.isValid()
            && this.boardConfig.initialSquares.every(e => e.every(e1 => this.piecePool.has(e1.name) && e1.owner <= this.participantCount && e1.zoneOwner <= this.participantCount))
            && Number.isInteger(this.participantCount) && this.participantCount > 0
            && Array.isArray(this.captureRules) && this.captureRules.every(e => e instanceof CaptureRuleConfig && e.isValid()
                && this.piecePool.has(e.capturing) && this.piecePool.has(e.captured)
                && e.previousCapturedAllowing.every(e1 => this.piecePool.has(e1))
                && e.dontImmediatelyRevenge.every(([k, v]) => this.piecePool.has(k) && this.piecePool.has(v)))
            && Array.isArray(this.dropRules) && this.dropRules.every(e => e instanceof DropRuleConfig && e.isValid()
                && this.piecePool.has(e.dropping) && this.piecePool.has(e.preventing))
            && Array.isArray(this.promotionRules) && this.promotionRules.every(e => e instanceof PromotionRuleConfig && e.isValid())
    }
}