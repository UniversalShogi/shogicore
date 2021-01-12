export default class Piece {
    #name;
    #owner;
    #movePower;

    constructor(name, owner, movePower) {
        this.#name = name;
        this.#owner = owner;
        this.#movePower = movePower;
    }

    getName() {
        return this.#name;
    }

    getOwner() {
        return this.#owner;
    }

    getMovePower() {
        return this.#movePower;
    }

    betray(newOwner) {
        this.#owner = newOwner;
    }
}