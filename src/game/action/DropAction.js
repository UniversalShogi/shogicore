import Action from './Action';

export default class DropAction extends Action {
    #piece;
    #dst;

    constructor(piece, dst) {
        super();
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