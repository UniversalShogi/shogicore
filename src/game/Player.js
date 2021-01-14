import MovePowerConfig from '../config/MovePowerConfig.js';
import DropAction from './action/DropAction.js';
import MoveAction from './action/MoveAction.js';
import PromotionAction from './action/PromotionAction.js';
import Grave from './Grave.js';
import Direction8 from './movement/Direction8.js';
import Movement from './movement/Movement.js';

export default class Player {
    #currentMoveCount = 0;
    #currentMoving = [null, null];
    #currentMovingPower = Movement.STEP;
    #currentCaptured = [];
    #previousDirection = Direction8.P;
    #currentPromotionRequest = null;
    #grave = new Grave();

    capture(piece) {
        this.#grave.addPiece(piece);
        this.#currentCaptured.push(piece);
    }

    hasInHand(piece) {
        return this.#grave.isDead(piece);
    }

    deleteFromHand(piece) {
        this.#grave.removePiece(piece);
    }

    hasPromotionRequest() {
        return this.#currentPromotionRequest !== null;
    }

    requestPromotion(src) {
        this.#currentPromotionRequest = src;
    }

    move(game, src, movement, direction, distance = 0, isLionKing = false) {
        let srcSquare = game.getSquareAt(src[0], src[1]);

        if (this.hasPromotionRequest() || (this.#currentMoveCount > 0 &&
                (this.#currentMovingPower !== movement || !this.#currentMoving.every((e, i) => src[i] === e))) ||
                !srcSquare.isOccupied()) {
            this.onInvalidAction(game, this.#currentPromotionRequest);
            return;
        }

        let movingPiece = srcSquare.getOccupyingPiece();
        
        let isTerminal = this.#currentMoveCount === Movement.LEG(movement);
        let action = new MoveAction(this, src, movement, direction, isTerminal, this.#currentMoveCount, this.#currentCaptured, distance, this.#previousDirection, isLionKing);

        if (!game.inflict(action)) {
            this.onInvalidAction(game, action);
        } else if (isTerminal) {
            this.#currentMoveCount = 0;
            this.#currentCaptured = [];
            this.#currentMoving = [null, null];
        } else {
            this.#previousDirection = direction;
            this.#currentMoveCount += 1;
            this.#currentMoving = action.calculateDestination(movingPiece.getOwner());
            this.#currentMovingPower = movement;
        }
    }

    drop(game, piece, dst) {
        if (this.hasPromotionRequest() || this.#currentMoveCount > 0)
            return;
        
        let action = new DropAction(this, piece, dst);
        if (!game.inflict(action))
            this.onInvalidAction(game, action);
    }

    promote(game, accept) {
        if (!this.hasPromotionRequest()) {
            this.onBrokenAction(game, Object.create(PromotionAction.prototype));
            return;
        }

        let promotionAction = new PromotionAction(this, this.#currentPromotionRequest, accept);

        if (accept && !game.inflict(promotionAction))
            this.onInvalidAction(game, promotionAction);
        else
            this.#currentPromotionRequest = null;
    }

    onBrokenAction(game, action) {

    }
    
    onInvalidAction(game, action) {

    }
}