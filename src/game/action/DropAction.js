import Action from './Action.js';

export default class DropAction extends Action {
    #piece;
    #dst;

    constructor(player, piece, dst) {
        super(player);
        this.#piece = piece;
        this.#dst = dst;
    }

    getPiece() {
        return this.#piece;
    }

    getDestination() {
        return this.#dst;
    }
}