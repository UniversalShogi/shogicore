export default class Square {
    #occupyingPiece;
    zoneOwner;

    constructor(occupyingPiece = null, zoneOwner = -1) {
        this.#occupyingPiece = occupyingPiece;
        this.zoneOwner = zoneOwner;
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

    getZoneOwner() {
        return this.zoneOwner;
    }
}