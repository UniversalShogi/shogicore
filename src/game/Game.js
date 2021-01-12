export default class Game {
    #board;
    #dropsEnabled;
    #participantCount;
    #participants = [];
    #turn = 0;

    constructor(board, participantCount, dropsEnabled) {
        this.#board = board;
        this.#participantCount = participantCount;
        this.#dropsEnabled = dropsEnabled;
    }

    isDropsEnabled() {
        return this.#dropsEnabled;
    }

    getBoardWidth() {
        return this.#board.getWidth();
    }

    getBoardHeight() {
        return this.#board.getHeight();
    }

    getSquareAt(row, column) {
        return this.#board.getSquareAt(row, column);
    }

    getCurrentParticipantCount() {
        return this.#participants.length;
    }

    getParticipantCount() {
        return this.#participantCount;
    }

    isFull() {
        return this.getCurrentParticipantCount() === this.getParticipantCount();
    }

    getParticipant(index) {
        return this.#participants[index];
    }

    addParticipant(player) {
        this.#participants.push(player);
    }

    removeParticipant(player) {
        if (this.isParticipating(player))
            this.#participants.splice(this.#participants.indexOf(player), 1);
    }

    isParticipating(player) {
        return this.#participants.includes(player);
    }
}