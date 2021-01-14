export default class Square {
    #zoneOwner;
    #occupyingPiece;

    constructor(zoneOwner = -1, occupyingPiece = null) {
        this.#zoneOwner = zoneOwner;
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
        return this.#occupyingPiece !== null;
    }

    getZoneOwner() {
        return this.#zoneOwner;
    }
}