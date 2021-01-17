import DropAction from './action/DropAction.js';
import MoveAction from './action/MoveAction.js';
import PromotionAction from './action/PromotionAction.js';
import Direction8 from './movement/Direction8.js';
import DirectionE from './movement/DirectionE.js';
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
    #currentMoves = [];
    #currentCaptured = [];

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
        this.#currentMoves = [];
        this.#currentCaptured = [];
    }

    getAvailableDrops(owner) {
        let player = this.getParticipant(owner);
        let grave = player.getGrave();
        let pieceCount = grave.getPieceCount();
        let drops = [];

        for (let i = 0; i < pieceCount; i++)
            for (let j = 0; j < this.#board.getHeight(); j++)
                for (let k = 0; k < this.#board.getWidth(); k++)
                    if (!this.getSquareAt(j, k).isOccupied()) {
            let drop = new DropAction(player, grave.getPiece(i), [j, k]);
            if (this.#ruleset.getDropRule().isDroppable(this.#board, owner, drop))
                drops.push(drop);
        }

        return drops;
    }

    getAvailablableMoves(src) {
        let srcSquare = this.getSquareAt(src[0], src[1]);
        if (!srcSquare.isOccupied())
            return [];
        let available = [];
        let srcPiece = srcSquare.getOccupyingPiece();
        let owner = srcPiece.getOwner();
        if (this.currentMoveCount() > 0) {
            let power = this.#currentMoves[this.#currentMoves.length - 1].getMovement();
            let currDir = this.#currentMoves[this.#currentMoves.length - 1].getDirection();
            let _dir = srcPiece.getMovePowers().find(e => e[0] === power && Direction8.INCLUDES(e[1], currDir))[1];
            let dirs;
            if (Movement.LIONLIKE(power)) {
                if (Direction8.SPECIAL(_dir))
                    dirs = Direction8.SET(_dir);
                else {
                    dirs = [_dir];
                    if (this.#currentMoves.filter(e => e.getDirection() === _dir).length
                        > this.#currentMoves.filter(e => e.getDirection() === Direction8.invert(_dir)))
                        dirs.push(Direction8.invert(_dir));
                }
            } else if (Movement.HOOKLIKE(power))
                dirs = Direction8.SET(_dir).filter(e => e !== currDir && e !== Direction8.invert(currDir)).concat([Direction8.P]);
            for (let dir of dirs)
                if (Movement.RANGING(power)) {
                    for (let i = 1; i < this.#board.getWidth() || i < this.#board.getHeight(); i++) {
                        let action = new MoveAction(this.getParticipant(owner), src, power, dir, i);
                        let dst = action.calculateDestination(owner);
                        if (!this.#board.has(dst[0], dst[1]))
                            break;
                        let dstSquare = this.getSquareAt(dst[0], dst[1]);

                        if (dstSquare.isOccupied()) {
                            if (dstSquare.getOccupyingPiece().getOwner() !== owner && this.#ruleset.getCaptureRule().isCapturable(this.#board, owner, action,
                                this.#previousTerminalCapture, this.currentMoveCount(), this.#currentCaptured))
                                available.push(action);
                            break;
                        }

                        available.push(action);
                    }
                } else {
                    let action = new MoveAction(this.getParticipant(owner), src, power, dir);
                    let dst = action.calculateDestination(owner);
                    if (!this.#board.has(dst[0], dst[1]))
                        continue;
                    let dstSquare = this.getSquareAt(dst[0], dst[1]);
                    
                    if (!dstSquare.isOccupied() || dstSquare.getOccupyingPiece().getOwner() !== owner)
                        available.push(action);
                }
        } else {
            for (let [power, _dir] of srcPiece.getMovePowers())
                for (let dir of ((Movement.LIONLIKE(power) || Movement.HOOKLIKE(power)) && Direction8.SPECIAL(_dir)) ? Direction8.SET(_dir) : [_dir])
                    if (power === Movement.EMPEROR) {
                        for (let i = 0; i < this.#board.getHeight(); i++)
                            for (let j = 0; j < this.#board.getWidth(); j++) {
                                let dstSquare = this.getSquareAt(i, j);
                                if (dstSquare.isOccupied() && dstSquare.getOccupyingPiece().getOwner() === owner)
                                    continue;
                                if (!this.#board.isProtectingng([i, j], 1 - owner))
                                    available.push(new MoveAction(this.getParticipant(owner), src, power, new DirectionE([i, j])));
                            }
                    } else if (Movement.JUMPING(power)) {
                        let leap = power === Movement.LJUMP ? dir.to : Infinity;

                        for (let i = 1; i < this.#board.getWidth() || i < this.#board.getHeight(); i++) {
                            let action = new MoveAction(this.getParticipant(owner), src, power, dir, i);
                            let dst = action.calculateDestination(owner);
                            if (!this.#board.has(dst[0], dst[1]))
                                break;
                            let dstSquare = this.getSquareAt(dst[0], dst[1]);

                            if (dstSquare.isOccupied()) {
                                if (dstSquare.getOccupyingPiece().getOwner() !== owner && this.#ruleset.getCaptureRule().isCapturable(this.#board, owner, action,
                                    this.#previousTerminalCapture, this.currentMoveCount(), this.#currentCaptured))
                                    available.push(action);
                                if (srcPiece.getGeneralRank() !== -1 && dstSquare.getOccupyingPiece().getGeneralRank() >= srcPiece.getGeneralRank())
                                    break;
                                if (leap-- <= 0)
                                    break;
                            } else if (power !== Movement.CJUMP)
                                available.push(action);
                        }
                    } else if (Movement.RANGING(power)) {
                        let from = power === Movement.LRANGE ? dir.from : 1;
                        let to = power === Movement.LRANGE ? dir.to : Infinity;

                        for (let i = from; (i < this.#board.getWidth() || i < this.#board.getHeight()) && i < to; i++) {
                            let action = new MoveAction(this.getParticipant(owner), src, power, dir, i);
                            let dst = action.calculateDestination(owner);
                            if (!this.#board.has(dst[0], dst[1]))
                                break;
                            let dstSquare = this.getSquareAt(dst[0], dst[1]);

                            if (dstSquare.isOccupied()) {
                                if (dstSquare.getOccupyingPiece().getOwner() !== owner && this.#ruleset.getCaptureRule().isCapturable(this.#board, owner, action,
                                    this.#previousTerminalCapture, this.currentMoveCount(), this.#currentCaptured))
                                    available.push(action);
                                break;
                            }

                            available.push(action);
                        }
                    } else {
                        let action = new MoveAction(this.getParticipant(owner), src, power, dir);
                        let dst = action.calculateDestination(owner);
                        if (!this.#board.has(dst[0], dst[1]))
                            continue;
                        let dstSquare = this.getSquareAt(dst[0], dst[1]);
                        
                        if (!dstSquare.isOccupied() || dstSquare.getOccupyingPiece().getOwner() !== owner)
                            available.push(action);
                    }
        }

        return available;
    }

    isCheck(turn) {
        if (!this.#board.hasUniqueRoyal(turn))
            return false;
        return this.#board.isAttacking(this.#board.getFirstRoyalLocation(turn), 1 - turn);
    }

    isCheckmate(turn) {

    }

    currentMoveCount()  {
        return this.#currentMoves.length;
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
                let movement = action.getMovement();
                
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
                if (this.currentMoveCount() === 0) this.#lastPos[0] = src;
                this.#lastPos[1] = dst;

                let dstSquare = this.getSquareAt(dst[0], dst[1]);

                this.#previousTerminalCapture = null;
                if (srcSquare === dstSquare)
                    return;
                
                if (dstSquare.isOccupied()) {
                    let dstPiece = dstSquare.getOccupyingPiece();
                    let originalName = dstPiece.getOriginalName();
                    let originalConfig = this.#piecePool.get(originalName);
                    this.#previousTerminalCapture = [this.#turn, src, dst, piece, dstPiece];
                    player.capture(new Piece(originalName, this.getParticipantIndex(player), originalConfig.movePowers, false, originalConfig.promotesTo, originalName,
                        originalConfig.isKing, originalConfig.generalRank, originalConfig.noSuicide));
                }

                if (movement === Movement.PENETRATE) {
                    let [x, y] = action.calculateDirection(this.#turn);
                    for (let i = 1; i < action.getDistance() - 1; i++) {
                        let square = this.getSquareAt(src[0] + x * i, src[1] + y * i);
                        
                        if (square.isOccupied()) {
                            let dstPiece = square.getOccupyingPiece();
                            let originalName = dstPiece.getOriginalName();
                            let originalConfig = this.#piecePool.get(originalName);
                            player.capture(new Piece(originalName, this.getParticipantIndex(player), originalConfig.movePowers, false, originalConfig.promotesTo,
                                originalName, originalConfig.isKing, originalConfig.generalRank, originalConfig.noSuicide));
                            square.vacate();        
                        }
                    }
                }

                if (movement === Movement.IGUI) {
                    this.getSquareAt(dst[0], dst[1]).vacate();
                } else {
                    this.getSquareAt(dst[0], dst[1]).occupy(piece);
                    srcSquare.vacate();
                }
                
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
                srcSquare.occupy(new Piece(promotedName, this.getParticipantIndex(player), promotedConfig.movePowers, true, '', piece.getName(), promotedConfig.isKing, promotedConfig.generalRank, promotedConfig.noSuicide));
            }

            default:
        }
    }

    inflict(action) {
        let player = action.getPlayer();

        if (this.getTurnParticipant() !== player)
            return 0;
        
        switch (action.constructor) {
            case DropAction: {
                let dst = action.getDestination();
                let piece = action.getPiece();

                if (!this.#board.has(dst[0], dst[1]))
                    return 0;
                
                if (piece.getOwner() !== this.#turn || !player.hasInHand(piece)
                    || this.getSquareAt(dst[0], dst[1]).isOccupied()
                    || !this.#ruleset.getDropRule().isDroppable(this.#board, this.#turn, action))
                    return 0;

                this.godInflict(action);
                this.#ruleset.getAfterRule().onAfterDrop(this.#board, this.#turn, action, this.currentMoveCount(), this.#currentCaptured);
                this.changeTurn();    
                break;
            }

            case MoveAction: {
                let promote = 0b00;
                let src = action.getSource();
                let movement = action.getMovement();
                let moveCount = this.currentMoveCount();
                let direction = action.getDirection();

                if (Direction8.SPECIAL(moveCount))
                    return 0;
                
                if (!this.#board.has(src[0], src[1]))
                    return 0;
                
                let srcSquare = this.getSquareAt(src[0], src[1]);
                
                if (!srcSquare.isOccupied() || srcSquare.getOccupyingPiece().getOwner() !== this.#turn)
                    return 0;
                
                let piece = srcSquare.getOccupyingPiece();

                if (!((() => {
                    if (moveCount > 0) {
                        if (movement !== this.#currentMoves[0].getMovement())
                            return false;
                        if (!this.#currentMoves[this.currentMoveCount() - 1].calculateDestination(this.#turn).every((e, i) => e === src[i]))
                            return false;
                        let currDir = this.#currentMoves[0].getDirection();
                        let dir = piece.getMovePowers().find(e => e[0] === movement && Direction8.INCLUDES(e[1], currDir))[1];
    
                        if (Movement.LIONLIKE(movement)) {
                            if (direction === Direction8.P)
                                return true;
                            if (Direction8.SPECIAL(dir))
                                return Direction8.INCLUDES(dir, direction);
                            if (direction === currDir)
                                return true;
                            if (this.#currentMoves.filter(e => e.getDirection() === dir).length
                                > this.#currentMoves.filter(e => e.getDirection() === Direction8.invert(dir)))
                                if (direction === Direction8.invert(dir))
                                    return true;
                        } else if (Movement.HOOKLIKE(movement)) {
                            if (direction === Direction8.P)
                                return true;
                            if (Direction8.SET(dir).filter(e => e !== currDir && e !== Direction8.invert(currDir)).includes(direction))
                                return true;
                        }
                    } else return piece.getMovePowers().some(([power, dir]) => {
                        if (power !== movement)
                            return false;
                        if (dir === direction) return true;
                        if (movement === Movement.EMPEROR)
                            return direction instanceof DirectionE && direction.dst != null && this.#board.has(direction.dst[0], direction.dst[1]);
                        if (movement === Movement.GENERALSTEP)
                            return dir.equals(direction);
                        if (Movement.L(movement))
                            return dir.equals(direction);
                        if (Movement.LIONLIKE(movement) || Movement.HOOKLIKE(moveCount))
                            if (Direction8.INCLUDES(dir, direction))
                                return true;
                        return false;
                    });

                    return false;
                })()))
                    return 0;

                let dst = action.calculateDestination(srcSquare.getOccupyingPiece().getOwner());

                if (!this.#board.has(dst[0], dst[1]))
                    return 0;

                let dstSquare = this.getSquareAt(dst[0], dst[1]);

                if (movement === Movement.CJUMP || movement === Movement.IGUI) {
                    if (!dstSquare.isOccupied() || dstSquare.getOccupyingPiece().getOwner() === this.#turn)
                        return 0;
                }

                if (Movement.RANGING(movement)) {
                    if (action.getDistance() <= 0)
                        return 0;

                    switch (movement) {
                        case Movement.HOOK:
                        case Movement.SHOOK:
                        case Movement.RANGE: {
                            let [x, y] = action.calculateDirection(this.#turn);
                            for (let i = 1; i < action.getDistance() - 1; i++)
                                if (this.getSquareAt(src[0] + x * i, src[1] + y * i).isOccupied())
                                    return 0;
                            break;
                        }

                        case Movement.LRANGE: {
                            if (action.getDistance() < direction.from || action.getDistance() > direction.to)
                                return 0;
                            let [x, y] = action.calculateDirection(this.#turn);
                            for (let i = direction.from; i < action.getDistance() - 1; i++)
                                if (this.getSquareAt(src[0] + x * i, src[1] + y * i).isOccupied())
                                    return 0;
                            break;
                        }

                        case Movement.LJUMP: {
                            let leap = direction.to;
                            let [x, y] = action.calculateDirection(this.#turn);
                            for (let i = 1; i < action.getDistance() - 1; i++) {
                                let square = this.getSquareAt(src[0] + x * i, src[1] + y * i);
                                if (square.isOccupied())
                                    if (piece.getGeneralRank() !== -1 && square.getOccupyingPiece().getGeneralRank() >= piece.getGeneralRank())
                                        return 0;
                                    else if (leap-- <= 0)
                                        return 0;
                            }

                            break;
                        }

                        
                        case Movement.JUMP:
                        case Movement.CJUMP:
                        case Movement.PENETRATE: {
                            if (piece.getGeneralRank() === -1)
                                break;
                            let [x, y] = action.calculateDirection(this.#turn);
                            for (let i = 1; i < action.getDistance() - 1; i++) {
                                let square = this.getSquareAt(src[0] + x * i, src[1] + y * i);
                                if (square.isOccupied() && square.getOccupyingPiece().getGeneralRank() >= piece.getGeneralRank())
                                    return 0;
                            }

                            break;
                        }

                        default:
                    }
                }

                let capture = false;

                if (srcSquare !== dstSquare) {
                    if (dstSquare.isOccupied()) {
                        if (dstSquare.getOccupyingPiece().getOwner() === this.#turn
                            || !this.#ruleset.getCaptureRule().isCapturable(this.#board, this.#turn, action, this.#previousTerminalCapture, this.currentMoveCount(), this.#currentCaptured))
                            return 0;
                        if (movement === Movement.PENETRATE)
                            for (let i = 1; i < action.getDistance() - 1; i++) {
                                let square = this.getSquareAt(src[0] + x * i, src[1] + y * i);
                                if (square.isOccupied())
                                    if (!this.#ruleset.getCaptureRule().isCapturable(this.#board, this.#turn,
                                        action,
                                        this.#previousTerminalCapture, i, this.#currentCaptured)) {
                                        this.#currentCaptured = [];
                                        return 0;
                                    } else {
                                        this.#currentCaptured.push(square.getOccupyingPiece());
                                    }
                            }
                        capture = true;
                        this.#currentCaptured.push(dstSquare.getOccupyingPiece());
                        
                    }

                    // if (this.#board.isStuck(src))
                    //     promote |= this.#ruleset.getPromotionRule().isPromotableOnStuck(this.#board, this.#turn, action);
                }

                let isTerminal = moveCount === Movement.LEG(movement) || (capture && Movement.S(movement));

                if (isTerminal && srcSquare.getOccupyingPiece().isPromotable()) {
                    let initLoc = this.currentMoveCount() > 0 ? this.#currentMoves[0].getSource() : src;
                    let initSquare = this.getSquareAt(initLoc[0], initLoc[1]);
                    if (initSquare.getZoneOwner() !== -1 && initSquare.getZoneOwner() !== this.#turn)
                        promote |= this.#ruleset.getPromotionRule().isPromotableFromEnemyZone(this.#board, this.#turn, action, this.currentMoveCount(), this.#currentCaptured);
                    if (dstSquare.getZoneOwner() !== -1 && initSquare.getZoneOwner() !== dstSquare.getZoneOwner() && dstSquare.getZoneOwner() !== this.#turn
                        && movement !== Movement.IGUI)
                        promote |= this.#ruleset.getPromotionRule().isPromotableEnteringEnemyZone(this.#board, this.#turn, action, this.currentMoveCount(), this.#currentCaptured);
                    if (this.#currentCaptured.length > 0)
                        promote |= this.#ruleset.getPromotionRule().isPromotableOnCapture(this.#board, this.#turn, action, this.currentMoveCount(), this.#currentCaptured);
                }

                this.godInflict(action);

                if (!isTerminal)
                    this.#currentMoves.push(action);

                if (isTerminal)
                    this.#ruleset.getAfterRule().onAfterMove(this.#board, this.#turn, action, this.currentMoveCount(), this.#currentCaptured);
                
                if (!(movement === Movement.IGUI ? srcSquare : dstSquare).isOccupied())
                    promote = PromotionRule.NO;
                
                if (this.#board.royalElliminated(1 - this.#turn)) // ASSUMING TWO PLAYERS
                    this.#ruleset.getAfterRule().onRoyalElliminated(this.#board, this.#turn, action, 1 - this.#turn, this.currentMoveCount(), this.#currentCaptured);

                if (isTerminal && (promote & PromotionRule.ABLE) !== PromotionRule.ABLE)
                    this.changeTurn();
                
                if (promote === PromotionRule.NO)
                    return isTerminal ? 2 : 1;

                if ((promote & PromotionRule.MUST) === PromotionRule.MUST)
                    this.godInflict(new PromotionAction(player, dst, true));
                else if ((promote & PromotionRule.ABLE) === PromotionRule.ABLE)
                    player.requestPromotion(dst);
                return isTerminal ? 2 : 1;
            }

            case PromotionAction: {
                let src = action.getSource();
                
                if (!this.#board.has(src[0], src[1]))
                    return 0;
                
                if (action.isAccept()) {
                    this.godInflict(action);
                    this.#ruleset.getAfterRule().onAfterPromotion(this.#board, this.#turn, action);
                }

                this.changeTurn();
                break;
            }

            default:
                return 0;
        }

        return 1;
    }
}