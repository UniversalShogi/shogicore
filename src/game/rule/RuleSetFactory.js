import CaptureRule from "./CaptureRule";
import RuleSet from "./RuleSet";

export default class RuleSetFactory {
    static get(captureRules, dropRules, promotionRules) {
        let captureRule = new CaptureRule();
        captureRule.isCapturable = function(board, moveAction, previousTerminalCapture) {
            for (let rule of captureRules) {
                
            }
        }
    }
}