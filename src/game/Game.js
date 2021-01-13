import DropAction from './action/DropAction';
import MoveAction from './action/MoveAction';
import PromotionAction from './action/PromotionAction';
import Piece from './Piece';
import PromotionRule from './rule/PromotionRule';

export default class Game {
    #board;
    #participantCount;
    #participants;
    #ruleset;
    #kifu;
    #isGenerous;
    #piecePool;
    #turn = 0;

    constructor(board, participantCount, ruleset, piecePool) {
        this.#board = board;
        this.#participantCount = participantCount;
        this.#participants = Array(participantCount).fill(null);
        this.#ruleset = ruleset;
        this.#piecePool = piecePool;
    }

    getBoard() {
        return this.#board;
    }

    getSquareAt(row, column) {
        return this.#board.getSquareAt(row, column);
    }

    getCurrentParticipantCount() {
        return this.#participants.filter(e => e !== null).length;
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

    getFirstEmptySlot() {
        return this.#participants.indexOf(null);
    }

    addParticipant(player, index) {
        if (index < participantCount)
            this.#participants[index] = player;
    }

    removeParticipant(index) {
        if (index < participantCount)
            this.#participants[index] = null;
    }

    isParticipating(player) {
        return this.#participants.includes(player);
    }

    getParticipantIndex(player) {
        return this.#participants.indexOf(player);
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
        let player = action.getPlayer();

        switch (action.constructor) {
            case DropAction: {
                let piece = action.getPiece();
                player.drop(piece);
                let dst = action.getDestination();
                this.getSquareAt(dst[0], dst[1]).occupy(piece);
                break;
            }

            case MoveAction: {
                let src = action.getSource();
                let srcSquare = this.getSquareAt(src[0], src[1]);
                let dst = action.calculateDestination();
                let dstSquare = this.getSquareAt(dst[0], dst[1]);

                if (!srcSquare.isOccupied())
                    return;
                
                let piece = srcSquare.getOccupyingPiece();
                
                if (dstSquare.isOccupied()) {
                    let originalName = dstSquare.getOccupyingPiece().getOriginalName();
                    let originalConfig = this.#piecePool.get(originalName);
                    player.capture(new Piece(originalName, this.getParticipantIndex(player), originalConfig.movePowers, false, originalConfig.promotesTo));
                }
                
                this.getSquareAt(dst[0], dst[1]).occupy(piece);
                srcSquare.vacate();
                
                break;
            }

            case PromotionAction: {
                let src = action.getSource();
                let srcSquare = this.getSquareAt(src[0], src[1]);

                if (!srcSquare.isOccupied() || !srcSquare.getOccupyingPiece().isPromotable())
                    return;
                
                let promotedName = srcSquare.getOccupyingPiece().getPromotedName();
                let promotedConfig = this.#piecePool.get(promotedName);
                srcSquare.occupy(new Piece(promotedName, this.getParticipantIndex(player), promotedConfig.movePowers, true, promotedConfig.promotesTo));
            }

            default:
        }
    }

    inflict(action) {
        let player = action.getPlayer();

        if (this.getTurnParticipant() !== player)
            return false;
        
        switch (action.constructor) {
            case DropAction: {
                if (piece.getOwner() !== this.#turn || !player.hasInHand(piece)
                    || this.getSquareAt(dst[0], dst[1]).isOccupied()
                    || !this.#ruleset.dropRule.isDroppable(this.#board, action))
                    return false;

                this.godInflict(action);
                this.changeTurn();    
                break;
            }

            case MoveAction: {
                let promote = 0b00;
                let src = action.getSource();
                let srcSquare = this.getSquareAt(src[0], src[1]);
                
                if (!srcSquare.isOccupied() || srcSquare.getOccupyingPiece().getOwner() !== this.#turn)
                    return false;
                
                let dst = action.calculateDestination();
                let dstSquare = this.getSquareAt(dst[0], dst[1]);

                if (dstSquare.isOccupied()) {
                    if (dstSquare.getOccupyingPiece().getOwner() === this.#turn || !this.#ruleset.captureRule.isCapturable(this.#board, action))
                        return false;
                    promote |= this.#ruleset.promotionRule.isPromotableOnCapture(this.#board, action);
                }

                if (dstSquare.getZoneOwner() !== -1 && dstSquare.getZoneOwner() !== this.#turn)
                    promote |= this.#ruleset.promotionRule.isPromotableEnteringEnemyZone(this.#board, action);
                
                this.godInflict(action);

                if (action.isTerminal())
                    this.changeTurn();
                
                if (!srcSquare.getOccupyingPiece().isPromotable())
                    break;
                
                let promotionAction = new PromotionAction(action.getPlayer(), dst);

                if (promote & PromotionRule.MUST === PromotionRule.MUST)
                    this.godInflict(promotionAction);
                else if (promote & PromotionRule.ABLE === PromotionRule.ABLE)
                    player.requestPromotion(promotionAction);
                break;
            }

            case PromotionAction: {
                this.godInflict(action);
                break;
            }

            default:
                return false;
        }

        return true;
    }
}