import Config from './Config.js';

export default class DropRuleConfig extends Config {
    columnOrRow;
    dropping;
    preventing;

    isValid() {
        return typeof this.columnOrRow === 'boolean' &&
            typeof this.dropping === 'string' &&
            typeof this.preventing === 'string'
    }
}