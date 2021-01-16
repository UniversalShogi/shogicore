export default class Piece {
    #name;
    #owner;
    #movePowers;
    #promotesTo;
    #promoted;
    #originalName;
    #isKing;
    #generalRank;
    #noSuicide;

    constructor(name, owner, movePowers, promoted = false, promotesTo = null, originalName = name, isKing = false, generalRank = 0, noSuicide = false) {
        this.#name = name;
        this.#owner = owner;
        this.#movePowers = movePowers;
        this.#promotesTo = promotesTo;
        this.#promoted = promoted;
        this.#originalName = originalName;
        this.#isKing = isKing;
        this.#generalRank = generalRank;
        this.#noSuicide = noSuicide;
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
        return Boolean(this.#promotesTo);
    }

    isPromoted() {
        return this.#promoted;
    }

    getPromotedName() {
        return this.#promotesTo;
    }

    setPromotedName(name) {
        this.#promotesTo = name;
    }

    getOriginalName() {
        return this.#originalName;
    }

    isKing() {
        return this.#isKing;
    }

    getGneralRank() {
        return this.#generalRank;
    }

    noSuicide() {
        return this.#noSuicide;
    }
}