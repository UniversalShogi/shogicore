import Action from './Action';

export default class PromotionAction extends Action {
    #src;

    constructor(player, src) {
        super(player);
        this.#src = src;
    }

    getSource() {
        return this.#src;
    }
}