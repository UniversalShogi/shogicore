import RuleSet from "./RuleSet";

export default class RuleSetFactory {
    static get(captureRuleStr, dropRuleStr, promotionRuleStr) {
        let ruleSet = new RuleSet();
        return ruleSet;
    }
}