export default {
    K: 16,
    NE: 0,
    N: 1,
    NW: 2,
    E: 3,
    P: 4,
    W: 5,
    SE: 6,
    S: 7,
    SW: 8,
    STANDARD: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    ROOK: [1, 3, 5, 7],
    BISHOP: [0, 2, 4, 8],

    invert(direction) {
        return 8 - direction;
    }
}