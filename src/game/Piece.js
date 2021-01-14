export default class Piece {
    #name;
    #owner;
    #movePowers;
    #promotesTo;
    #promoted;
    #originalName;
    #isKing;

    constructor(name, owner, movePowers, promoted = false, promotesTo = null, originalName = name, isKing = false) {
        this.#name = name;
        this.#owner = owner;
        this.#movePowers = movePowers;
        this.#promotesTo = promotesTo;
        this.#promoted = promoted;
        this.#originalName = originalName;
        this.#isKing = isKing;
    }

    getName() {
        return this.#name;
    }

    getOwner() {
        return this.#owner;
    }

    getMovePowers() {
        return this.#movePowers;
    }

    betray(newOwner) {
        this.#owner = newOwner;
    }

    isPromotable() {
        return this.#promotesTo != null;
    }

    isPromoted() {
        return this.#promoted;
    }

    getPromotedName() {
        return this.#promotesTo;
    }

    getOriginalName() {
        return this.#originalName;
    }

    isKing() {
        return this.#isKing;
    }
}