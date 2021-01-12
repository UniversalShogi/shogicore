import Config from './Config';

export default class SquareConfig extends Config {
    static BLANK = 'BLANK';
    
    name;
    owner;

    isValid() {
        return typeof this.name === 'string' && Number.isInteger(owner) && owner > 0;
    }
}