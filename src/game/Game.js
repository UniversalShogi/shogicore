import DropAction from './action/DropAction.js';
import MoveAction from './action/MoveAction.js';
import PromotionAction from './action/PromotionAction.js';
import Direction8 from './movement/Direction8.js';
import Movement from './movement/Movement.js';
import Piece from './Piece.js';
import PromotionRule from './rule/PromotionRule.js';

export default class Game {
    #board;
    #participantCount;
    #participants;
    #ruleset;
    #kifu;
    #isGenerous;
    #previousTerminalCapture = null;
    #piecePool;
    #lastPos = [[-1, -1], [-1, -1]];
    #lastAction = null;
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
        if (index < this.#participantCount)
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

    getTurn() {
        return this.#turn;
    }

    getLastPos() {
        return this.#lastPos;
    }

    getLastAction() {
        return this.#lastAction;
    }

    changeTurn() {
        this.#turn = (this.#turn + 1) % this.getParticipantCount();
    }

    godInflict(action) {
        let player = action.getPlayer();

        switch (action.constructor) {
            case DropAction: {  
                let piece = action.getPiece();
                let dst = action.getDestination();

                if (!this.#board.has(dst[0], dst[1]))
                    return;
                
                this.#lastAction = action;
                this.#lastPos = [dst, dst];
                player.deleteFromHand(piece);
                this.getSquareAt(dst[0], dst[1]).occupy(piece);
                break;
            }

            case MoveAction: {
                let src = action.getSource();
                
                if (!this.#board.has(src[0], src[1]))
                    return;
                
                let srcSquare = this.getSquareAt(src[0], src[1]);

                if (!srcSquare.isOccupied())
                    return;
                
                let piece = srcSquare.getOccupyingPiece();
                
                let dst = action.calculateDestination(piece.getOwner());

                if (!this.#board.has(dst[0], dst[1]))
                    return;
                
                this.#lastAction = action;
                if (action.getMoveCount() === 0) this.#lastPos[0] = src;
                this.#lastPos[1] = dst;

                let dstSquare = this.getSquareAt(dst[0], dst[1]);

                this.#previousTerminalCapture = null;
                if (action.getDirection() === Direction8.P || srcSquare === dstSquare)
                    return;
                
                if (dstSquare.isOccupied()) {
                    let dstPiece = dstSquare.getOccupyingPiece();
                    let originalName = dstPiece.getOriginalName();
                    let originalConfig = this.#piecePool.get(originalName);
                    this.#previousTerminalCapture = [this.#turn, src, dst, piece, dstPiece];
                    player.capture(new Piece(originalName, this.getParticipantIndex(player), originalConfig.movePowers, false, originalConfig.promotesTo, originalName, originalConfig.isKing));
                }
                
                this.getSquareAt(dst[0], dst[1]).occupy(piece);
                srcSquare.vacate();
                
                break;
            }

            case PromotionAction: {
                let src = action.getSource();

                if (!this.#board.has(src[0], src[1]))
                    return;

                let srcSquare = this.getSquareAt(src[0], src[1]);

                if (!srcSquare.isOccupied() || !srcSquare.getOccupyingPiece().isPromotable())
                    return;
                
                this.#lastAction = action;
                this.#lastPos = [src, src];
                
                let piece = srcSquare.getOccupyingPiece();
                let promotedName = piece.getPromotedName();
                let promotedConfig = this.#piecePool.get(promotedName);
                srcSquare.occupy(new Piece(promotedName, this.getParticipantIndex(player), promotedConfig.movePowers, true, null, piece.getName(), promotedConfig.isKing));
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
                let dst = action.getDestination();

                if (!this.#board.has(dst[0], dst[1]))
                    return false;
                
                if (piece.getOwner() !== this.#turn || !player.hasInHand(piece)
                    || this.getSquareAt(dst[0], dst[1]).isOccupied()
                    || !this.#ruleset.getDropRule().isDroppable(this.#board, this.#turn, action))
                    return false;

                this.godInflict(action);
                this.changeTurn();    
                break;
            }

            case MoveAction: {
                let promote = 0b00;
                let src = action.getSource();
                let movement = action.getMovement();
                let moveCount = action.getMoveCount();
                let direction = action.getDirection();

                if (direction === Direction8.K)
                    return false;
                if (moveCount === 0 && movement === Movement.P)
                    return false;
                
                if (!this.#board.has(src[0], src[1]))
                    return false;
                
                let srcSquare = this.getSquareAt(src[0], src[1]);
                
                if (!srcSquare.isOccupied() || srcSquare.getOccupyingPiece().getOwner() !== this.#turn)
                    return false;
                
                let piece = srcSquare.getOccupyingPiece();
                
                if (!piece.getMovePowers().some(([power, dir]) => {
                    if (power === movement && dir === direction)
                        return true;

                    if (power === Movement.LION && movement === Movement.LION) {
                        if (moveCount === 1 && (direction === Direction8.P || direction === Movement.invert(dir)))
                            return true;
                        if (dir === Direction8.K)
                            return true;
                    }

                    return false;
                }))
                    return false;
                
                let dst = action.calculateDestination(srcSquare.getOccupyingPiece().getOwner());

                if (!this.#board.has(dst[0], dst[1]))
                    return false;

                let dstSquare = this.getSquareAt(dst[0], dst[1]);

                if (movement === Movement.RANGE) {
                    if (action.getDistance() <= 0)
                        return false;
                    let [x, y] = action.calculateDirection(this.#turn);
                    for (let i = 1; i < action.getDistance() - 1; i++)
                        if (this.getSquareAt(src[0] + x * i, src[1] + y * i).isOccupied())
                            return false;
                }

                if (srcSquare !== dstSquare) {
                    if (dstSquare.isOccupied()) {
                        if (dstSquare.getOccupyingPiece().getOwner() === this.#turn
                            || !this.#ruleset.getCaptureRule().isCapturable(this.#board, this.#turn, action, this.#previousTerminalCapture))
                            return false;
                        promote |= this.#ruleset.getPromotionRule().isPromotableOnCapture(this.#board, this.#turn, action);
                    }

                    if (srcSquare.getZoneOwner() !== -1 && srcSquare.getZoneOwner() !== this.#turn)
                        promote |= this.#ruleset.getPromotionRule().isPromotableFromEnemyZone(this.#board, this.#turn, action);

                    if (dstSquare.getZoneOwner() !== -1 && dstSquare.getZoneOwner() !== this.#turn)
                        promote |= this.#ruleset.getPromotionRule().isPromotableEnteringEnemyZone(this.#board, this.#turn, action);
                    
                    if (this.#board.isStuck(src))
                        promote |= this.#ruleset.getPromotionRule().isPromotableOnStuck(this.#board, this.#turn, action);
                }

                if (!srcSquare.getOccupyingPiece().isPromotable())
                    promote = PromotionRule.NO;
                this.godInflict(action);

                if (action.isTerminal() && (promote & PromotionRule.ABLE) !== PromotionRule.ABLE)
                    this.changeTurn();
                
                if (promote === PromotionRule.NO)
                    return true;

                if ((promote & PromotionRule.MUST) === PromotionRule.MUST)
                    this.godInflict(promotionAction);
                else if ((promote & PromotionRule.ABLE) === PromotionRule.ABLE)
                    player.requestPromotion(dst);
                break;
            }

            case PromotionAction: {
                let src = action.getSource();
                
                if (!this.#board.has(src[0], src[1]))
                    return false;
                
                if (action.isAccept())
                    this.godInflict(action);
                this.changeTurn();
                break;
            }

            default:
                return false;
        }

        return true;
    }
}