export default {
    K: 9,
    NE: 0,
    N: 1,
    NW: 2,
    E: 3,
    P: 4,
    W: 5,
    SE: 6,
    S: 7,
    SW: 8,

    invert(direction) {
        return 8 - direction;
    }
}