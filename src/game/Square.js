export default class Square {
    #occupyingPiece;

    constructor(occupyingPiece = null) {
        this.#occupyingPiece = occupyingPiece;
    }

    occupy(piece) {
        this.#occupyingPiece = piece;
    }

    vacate() {
        this.#occupyingPiece = null;
    }

    getOccupyingPiece() {
        return this.#occupyingPiece;
    }

    isOccupied() {
        return this.#occupyingPiece === null;
    }
}