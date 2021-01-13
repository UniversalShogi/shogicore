export default class Piece {
    #name;
    #owner;
    #movePowers;
    #promotesTo;
    #promoted;

    constructor(name, owner, movePowers, promoted = false, promotesTo = null, originalName = name) {
        this.#name = name;
        this.#owner = owner;
        this.#movePowers = movePowers;
        this.#promotesTo = promotesTo;
        this.#promoted = promoted;
        this.#originalName = name;
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
}