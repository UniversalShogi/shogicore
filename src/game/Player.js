import DropAction from './action/DropAction.js';
import MoveAction from './action/MoveAction.js';
import PromotionAction from './action/PromotionAction.js';
import Grave from './Grave.js';

export default class Player {
    #currentPromotionRequest = null;
    #grave = new Grave();

    capture(piece) {
        this.#grave.addPiece(piece);
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

    move(game, src, movement, direction, distance = 0) {
        let srcSquare = game.getSquareAt(src[0], src[1]);

        if (this.hasPromotionRequest()) {
            this.onInvalidAction(game, this.#currentPromotionRequest);
            return;
        }
        
        let action = new MoveAction(this, src, movement, direction, distance);

        let code = game.inflict(action);

        if (code === 0) {
            this.onInvalidAction(game, action);
        }
    }

    drop(game, piece, dst) {
        if (this.hasPromotionRequest())
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