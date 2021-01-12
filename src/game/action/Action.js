export default class Action {
    #player;

    constructor(player) {
        this.#player = player;
    }

    getPlayer() {
        return this.#player;
    }
}