export default class RuleSet {
    #captureRule;
    #dropRule;
    #promotionRule;

    constructor(captureRule, dropRule, promotionRule) {
        this.#captureRule = captureRule;
        this.#dropRule = dropRule;
        this.#promotionRule = promotionRule;
    }

    getCaptureRule() {
        return this.#captureRule;
    }

    getDropRule() {
        return this.#dropRule;
    }

    getPromotionRule() {
        return this.#promotionRule;
    }
}