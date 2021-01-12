import Grave from "./Grave";

export default class Player {
    #grave = new Grave();

    getGrave() {
        return this.#grave;
    }
}