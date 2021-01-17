export default {
    STEP: 1,
    RANGE: 2,
    DOUBLE: 3,
    LION: 4,
    SLION: 5,
    LION3: 6,
    SLION3: 7,
    CJUMP: 8,
    HOOK: 9,
    SHOOK: 10,
    EMPEROR: 11,
    JUMP: 12,
    PENETRATE: 13,
    GENERALSTEP: 14,
    IGUI: 15,
    LRANGE: 16,
    LJUMP: 17,

    LEG(movement) {
        if (movement === 4 || movement === 5 || movement === 9 || movement === 10)
            return 1;
        if (movement === 6 || movement === 7)
            return 2;
        return 0;
    },

    LIONLIKE(movement) {
        return movement === 4 || movement === 5 || movement === 6 || movement === 7;
    },

    HOOKLIKE(movement) {
        return movement === 9 || movement === 10;
    },

    RANGING(movement) {
        return movement === 2 || movement === 8 || movement === 9 || movement === 10 || movement === 12 || movement === 13 || movement === 16 || movement === 17; 
    },

    S(movement) {
        return movement === 5 || movement === 7 || movement === 10;
    },

    L(movement) {
        return movement === 16 || movement === 17;
    },

    JUMPING(movement) {
        return movement === 8 || movement === 12 || movement === 13 || movement === 17;
    }
}