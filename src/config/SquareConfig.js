import Config from './Config.js';

export default class SquareConfig extends Config {
    static BLANK = 'BLANK';
    
    name;
    owner;
    zoneOwner;

    isValid() {
        return typeof this.name === 'string' && Number.isInteger(this.owner) && this.owner > 0
            && Number.isInteger(this.zoneOwner) && this.zoneOwner >= 0;
    }
}