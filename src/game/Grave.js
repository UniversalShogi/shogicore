export default class Grave {
    #pieces = [];

    addPiece(piece) {
        this.#pieces.push(piece);
    }

    isDead(piece) {
        return this.#pieces.includes(piece);
    }

    removePiece(piece) {
        if (this.isDead(piece))
            this.#pieces.splice(this.#pieces.indexOf(piece), 1);
    }

    getPieceCount() {
        return this.#pieces.length;
    }

    getPiece(index) {
        return this.#pieces[index];
    }
}