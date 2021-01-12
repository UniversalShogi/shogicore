import Action from './Action';

export default class MoveAction extends Action {
    #src;
    #dst;
    #isTerminal;
    #moveCount;

    constructor(player, src, dst, isTerminal, moveCount) {
        super(player);
        this.#src = src;
        this.#dst = dst;
        this.#isTerminal = isTerminal;
        this.#moveCount = moveCount;
    }

    getSource() {
        return this.#src;
    }

    getDestination() {
        return this.#dst;
    }

    isTerminal() {
        return this.#isTerminal;
    }

    getMoveCount() {
        return this.#moveCount;
    }
}