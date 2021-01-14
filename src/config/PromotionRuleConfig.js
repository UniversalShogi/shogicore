import Config from './Config.js';

export default class PromotionRuleConfig extends Config {
    startZone;
    endZone;
    capture;

    isValid() {
        return typeof this.startZone === 'boolean'
            && typeof this.endZone === 'boolean'
            && typeof this.capture === 'boolean';
    }
}