import Config from './Config.js';

export default class CaptureRuleConfig extends Config {
    protected;
    capturing;
    captured;
    moveCount;
    previousCapturedAllowing;
    dontImmediatelyRevenge;

    isValid() {
        return typeof this.protected === 'boolean' && typeof this.capturing === 'string'
            && typeof this.captured === 'string' && Number.isInteger(this.moveCount) && this.moveCount >= 0
            && Array.isArray(this.previousCapturedAllowing) && this.previousCapturedAllowing.every(e => typeof e === 'string')
            && this.dontImmediatelyRevenge instanceof Map && this.dontImmediatelyRevenge.entries().every(([k ,v]) => typeof k === 'string' && typeof v === 'string');
    }
}