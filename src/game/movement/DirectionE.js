export default class DirectionE {
    dst;

    constructor(dst) {
        this.dst = dst;
    }

    equals(other) {
        return other instanceof DirectionE && other.dst != null && this.dst[0] === other.dst[0] && this.dst[1] === other.dst[1];
    }
}