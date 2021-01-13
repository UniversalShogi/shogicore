export default class PromotionRule {
    static NO = 0b00;
    static ABLE = 0b01;
    static MUST = 0b10;

    isPromotableOnCapture(board, moveAction) {
        return PromotionRule.NO;
    }

    isPromotableEnteringEnemyZone(board, moveAction) {
        return PromotionRule.NO;
    }

    isPromotableOnStuck(board, moveAction) {
        return PromotionRule.NO;
    }

    static isValid(str) {
        return false;
    }
}