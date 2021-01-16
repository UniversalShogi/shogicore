export default class RuleSet {
    #captureRule;
    #dropRule;
    #promotionRule;
    afterRule;

    constructor(captureRule, dropRule, promotionRule, afterRule) {
        this.#captureRule = captureRule;
        this.#dropRule = dropRule;
        this.#promotionRule = promotionRule;
        this.afterRule = afterRule;
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

    getAfterRule() {
        return this.afterRule;
    }
}