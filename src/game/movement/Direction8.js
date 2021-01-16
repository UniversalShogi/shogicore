const Direction8 = {
    R: 17,
    B: 18,
    K: 16,
    NW: 0,
    N: 1,
    NE: 2,
    W: 3,
    P: 4,
    E: 5,
    SW: 6,
    S: 7,
    SE: 8,
    STANDARD: [0, 1, 2, 3, 5, 6, 7, 8],
    ROOK: [1, 3, 5, 7],
    BISHOP: [0, 2, 6, 8],

    invert(direction) {
        return 8 - direction;
    },

    SPECIAL(direction) {
        return direction === Direction8.K || direction === Direction8.R || direction === Direction8.B;
    },

    SET(direction) {
        if (direction === Direction8.K)
            return Direction8.STANDARD;
        if (direction === Direction8.R)
            return Direction8.ROOK;
        if (direction === Direction8.B)
            return Direction8.BISHOP;
        return [];
    },

    INCLUDES(dir1, dir2) {
        if (dir1 === dir2)
            return true;
        return Direction8.SET(dir1).includes(dir2);
    }
};

export default Direction8;