import DropAction from './action/DropAction';
import MoveAction from './action/MoveAction';
import PromotionAction from './action/PromotionAction';
import Grave from './Grave';
import Direction8 from './movement/Direction8';
import Movement from './movement/Movement';

export default class Player {
    #currentMoveCount = 0;
    #currentCaptured = [];
    #previousDirection = Direction8.P;
    #currentPromotionRequest = null;
    #grave = new Grave();

    capture(piece) {
        this.#grave.addPiece(piece);
        currentCaptured.push(piece);
    }

    hasInHand(piece) {
        return this.#grave.isDead(piece);
    }

    drop(piece) {
        this.#grave.removePiece(piece);
    }

    hasPromoteRequest() {
        return this.#currentPromotionRequest !== null;
    }

    requestPromotion(promotionAction) {
        this.#currentPromotionRequest = promotionAction;
    }

    move(game, piece, src, movement, direction, distance = 0, isLionKing = false) {
        if (this.hasPromoteRequest())
            return;
        
        let isTerminal = this.#currentMoveCount === Movement.LEG(movement);
        let action = new MoveAction(this, src, movement, direction, isTerminal, this.#currentMoveCount, this.#currentCaptured, distance, this.#previousDirection, isLionKing);

        if (!game.inflict(action)) {
            this.onInvalidAction(game, action);
        } else if (isTerminal) {
            this.#currentMoveCount = 0;
            this.#currentCaptured = [];
        } else {
            this.#previousDirection = direction;
            this.#currentMoveCount += 1;
        }
    }

    drop(game, piece, dst) {
        if (this.hasPromoteRequest())
            return;
        
        let action = new DropAction(this, piece, dst);
        if (!game.inflict(action))
            this.onInvalidAction(game, action);
    }

    promote(game) {
        if (!this.hasPromoteRequest()) {
            this.onBrokenAction(game, Object.create(PromotionAction.prototype));
            return;
        }

        if (!game.inflict(this.#currentPromotionRequest))
            this.onInvalidAction(game, this.#currentPromotionRequest);
        else
            this.#currentPromotionRequest = null;
    }

    onBrokenAction(game, action) {

    }
    
    onInvalidAction(game, action) {

    }
}