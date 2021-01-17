export default class DirectionL {
    from;
    to;
    dir;

    constructor(dir, to = Infinity, from = 0) {
        this.from = from;
        this.to = to;
        this.dir = dir;
    }

    equals(other) {
        return other instanceof DirectionL &&
            this.dir === other.dir && this.from === other.from && this.to === other.to;
    }
}