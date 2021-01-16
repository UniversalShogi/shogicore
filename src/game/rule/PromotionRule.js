import PromotionAction from '../action/PromotionAction.js';

export default class PromotionRule {
    static NO = 0b00;
    static ABLE = 0b01;
    static MUST = 0b10;

    isPromotableOnCapture(board, turn, moveAction, currentMoveCount, currentCaptured) {
        return PromotionRule.NO;
    }

    isPromotableEnteringEnemyZone(board, turn, moveAction, currentMoveCount, currentCaptured) {
        return PromotionRule.NO;
    }

    isPromotableFromEnemyZone(board, turn, moveAction, currentMoveCount, currentCaptured) {
        return PromotionAction.NO;
    }

    // isPromotableOnStuck(board, turn, moveAction) {
    //     return PromotionRule.NO;
    // }
}