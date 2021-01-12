import DropAction from './action/DropAction';
import MoveAction from './action/MoveAction';
import Square from './Square';

export default class Game {
    #board;
    #participantCount;
    #participants = [];
    #ruleset;
    #kifu;
    #isGenerous;
    #turn = 0;

    constructor(board, participantCount, ruleset) {
        this.#board = board;
        this.#participantCount = participantCount;
        this.#ruleset = ruleset;
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

    getRuleSet() {
        return this.#ruleset;
    }

    getTurnParticipant() {
        return this.getParticipant(this.#turn);
    }

    changeTurn() {
        this.#turn = (this.#turn + 1) % this.getParticipantCount();
    }

    godInflict(action) {
        switch (action.constructor) {
            case DropAction: {
                let dst = action.getDestination();
                this.getSquareAt(dst[0], dst[1]).occupy(action.getPiece());
                break;
            }

            case MoveAction: {
                let src = action.getSource();
                let srcSquare = this.getSquareAt(src[0], src[1]);
                let dst = action.getDestination();

                if (!srcSquare.isOccupied())
                    return;
                
                this.getSquareAt(dst[0], dst[1]).occupy(srcSquare.getOccupyingPiece());
                srcSquare.vacate();
                
                break;
            }

            default:
        }
    }

    inflict(action) {
        if (this.getTurnParticipant() !== action.getPlayer())
            return false;
        
        switch (action.constructor) {
            case DropAction: {
                if (piece.getOwner() !== action.getPlayer() || this.getSquareAt(dst[0], dst[1]).isOccupied()
                    || !this.#ruleset.dropRule.isDroppable(action, this.#board, dst))
                    return false;

                this.godInflict(action);
                this.changeTurn();    
                break;
            }

            case MoveAction: {
                let src = action.getSource();
                let srcSquare = this.getSquareAt(src[0], src[1]);
                
                if (!srcSquare.isOccupied() || srcSquare.getOccupyingPiece().getOwner() !== action.getPlayer())
                    return false;
                
                this.godInflict(action);

                if (action.isTerminal())
                    this.changeTurn();
                break;
            }

            default:
        }

        return true;
    }
}