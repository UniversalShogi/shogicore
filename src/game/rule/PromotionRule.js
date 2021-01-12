export default class PromotionRule {
    static NO = 0;
    static ABLE = 1;
    static MUST = 2;

    isPromotableOnCapture(board, capturing, captured, src, dst, previousCaptured, moveCount) {
        return PromotionRule.NO;
    }

    isPromotableEnteringEnemyZone(board, piece, src, dst) {
        return PromotionRule.NO;
    }

    isPromotableOnStuck(board, piece, src, dst) {
        return PromotionRule.NO;
    }

    static isValid(str) {
        return false;
    }
}