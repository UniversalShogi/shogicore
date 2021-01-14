import Action from './Action.js';

export default class PromotionAction extends Action {
    #src;
    #accept;

    constructor(player, src, accept) {
        super(player);
        this.#src = src;
        this.#accept = accept;
    }

    getSource() {
        return this.#src;
    }

    isAccept() {
        return this.#accept;
    }
}