import PieceConfig from '../src/config/PieceConfig.js';
import DropAction from '../src/game/action/DropAction.js';
import Board from '../src/game/Board.js';
import Game from '../src/game/Game.js';
import Piece from '../src/game/Piece.js';
import AfterRule from '../src/game/rule/AfterRule.js';
import CaptureRule from '../src/game/rule/CaptureRule.js';
import DropRule from '../src/game/rule/DropRule.js';
import PromotionRule from '../src/game/rule/PromotionRule.js';
import RuleSet from '../src/game/rule/RuleSet.js';

class HookedPlayer extends Player {
    drop() {
        super.drop(...arguments);
        printBoard();
    }

    move() {
        super.move(...arguments);
        printBoard();
    }

    promote() {
        super.promote(...arguments);
        printBoard();
    }
}

function STEP(arr) {
    return arr.map(e => [Movement.STEP, e]);
}

function RANGE(arr) {
    return arr.map(e => [Movement.RANGE, e]);
}

function DOUBLE(arr) {
    return arr.map(e => [Movement.DOUBLE, e]);
}

function LION(arr) {
    return arr.map(e => [Movement.LION, e]);
}

function LION3(arr) {
    return arr.map(e => [Movement.LION3, e]);
}

function PENETRATE(arr) {
    return arr.map(e => [Movement.PENETRATE, e]);
}


const TEST_POOL = new Map(Object.entries({
    '大': new PieceConfig()
}));

let testBoard = new Board(20, 20);
let testGame = new Game(testBoard, 2, new RuleSet(new CaptureRule(), new DropRule(), new PromotionRule(), new AfterRule()), TEST_POOL);