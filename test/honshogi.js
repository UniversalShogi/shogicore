import PieceConfig from '../src/config/PieceConfig.js';
import DropAction from '../src/game/action/DropAction.js';
import MoveAction from '../src/game/action/MoveAction.js';
import Board from '../src/game/Board.js';
import Game from '../src/game/Game.js';
import Direction16 from '../src/game/movement/Direction16.js';
import Direction8 from '../src/game/movement/Direction8.js';
import Movement from '../src/game/movement/Movement.js';
import Piece from '../src/game/Piece.js';
import Player from '../src/game/Player.js';
import AfterRule from '../src/game/rule/AfterRule.js';
import CaptureRule from '../src/game/rule/CaptureRule.js';
import DropRule from '../src/game/rule/DropRule.js';
import PromotionRule from '../src/game/rule/PromotionRule.js';
import RuleSet from '../src/game/rule/RuleSet.js';
import Square from '../src/game/Square.js';

const STANDARD = Direction8.STANDARD;
const ROOK = Direction8.ROOK;
const N = Direction8.N;
const S = Direction8.S;
const ND = [Direction8.NE, Direction8.NW];
const SD = [Direction8.SE, Direction8.SW];
const EW = [Direction8.E, Direction8.W];
const BISHOP = Direction8.BISHOP;

console.time('random-game');

function STEP(arr) {
    return arr.map(e => [Movement.STEP, e]);
}

function RANGE(arr) {
    return arr.map(e => [Movement.RANGE, e]);
}

function DOUBLE(arr) {
    return arr.map(e => [Movement.DOUBLE, e]);
}
 
const HON_POOL = new Map(Object.entries({
    '步': new PieceConfig(STEP([N]), '金'),
    '香': new PieceConfig(RANGE([N]), '金'),
    '桂': new PieceConfig(DOUBLE([Direction16.NNE, Direction16.NNW]), '金'),
    '銀': new PieceConfig(STEP(BISHOP.concat([N])), '金'),
    '金': new PieceConfig(STEP(ROOK.concat(ND))),
    '飛': new PieceConfig(RANGE(ROOK), '龍'),
    '龍': new PieceConfig(RANGE(ROOK).concat(STEP(BISHOP))),
    '角': new PieceConfig(RANGE(BISHOP), '馬'),
    '馬': new PieceConfig(RANGE(BISHOP).concat(STEP(ROOK))),
    '玉': new PieceConfig(STEP(STANDARD), '', true),
    '王': new PieceConfig(STEP(STANDARD), '', true)
}));

const ZONE =
`222222222
222222222
222222222
000000000
000000000
000000000
111111111
111111111
111111111`.split('\n');

const OWNER =
`222222222
020000020
222222222
000000000
000000000
000000000
111111111
010000010
111111111`.split('\n');

const SETUP =
`香桂銀金王金銀桂香
無飛無無無無無角無
步步步步步步步步步
無無無無無無無無無
無無無無無無無無無
無無無無無無無無無
步步步步步步步步步
無角無無無無無飛無
香桂銀金玉金銀桂香`.split('\n');

let honBoard = new Board(9, 9);

for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++) {
        let square = new Square(parseInt(ZONE[i][j]) - 1);
        let owner = OWNER[i][j];
        
        if (owner !== '0') {
            let name = SETUP[i][j];
            let config = HON_POOL.get(name);
            square.occupy(new Piece(name, parseInt(owner) - 1, config.movePowers, false, config.promotesTo, name, config.isKing));
        }

        honBoard.setSquareAt(i, j, square);
    }

const HON_CAPTURERULE = new CaptureRule();

HON_CAPTURERULE.isCapturable = function() {
    return true;
}

const HON_DROPRULE = new DropRule();

HON_DROPRULE.isDroppable = function(board, turn, dropAction) {
    let dst = dropAction.getDestination();
    let piece = dropAction.getPiece();

    if (piece.getName() === '步') {
        if (turn === 0 && dst[0] === 0)
            return false;
        else if (turn === 1 && dst[0] === 8)
            return false;
        for (let i = 0; i < 9; i++) {
            let colSquare = board.getSquareAt(i, dst[1]);
            if (colSquare.isOccupied()) {
                let colPiece = colSquare.getOccupyingPiece();
                if (colPiece.getOwner() === turn && colPiece.getName() === '步')
                    return false;
            }
        }

        if (board.royalElliminated(1 - turn))
            return true;
        let opponentKingLoc = board.getFirstRoyalLocation(1 - turn);
        let okSquare = board.getSquareAt(opponentKingLoc[0], opponentKingLoc[1]);
        let opponentKing = okSquare.getOccupyingPiece();
        // VIRTUAL DROPS GOING
        board.getSquareAt(dst[0], dst[1]).occupy(piece);

        if (board.isProtecting(dst, opponentKingLoc) && !board.isProtectedBy(dst, 1 - turn))
            for (let move of honGame.getAvailablableMoves(opponentKingLoc)) {
                let kDst = move.calculateDestination(1 - turn);
                let kDstSquare = board.getSquareAt(kDst[0], kDst[1]);
                // VIRTUAL MOVE GOING
                let origPiece = kDstSquare.getOccupyingPiece();
                let check;
                kDstSquare.occupy(opponentKing);
                okSquare.vacate();
                if (board.isProtectedBy(kDst, turn))
                    check = true;
                okSquare.occupy(opponentKing);
                kDstSquare.occupy(origPiece);
                if (!check)
                    return true;
            }

        board.getSquareAt(dst[0], dst[1]).vacate();
    } else if (piece.getName() === '香') {
        if (turn === 0 && dst[0] === 0)
            return false;
        else if (turn === 1 && dst[0] === 8)
            return false;
    } else if (piece.getName() === '桂')
        if (turn === 0 && dst[0] <= 1)
            return false;
        else if (turn === 1 && dst[0] >= 7)
            return false;

    return true;
}

const HON_PROMOTIONRULE = new PromotionRule();

HON_PROMOTIONRULE.isPromotableEnteringEnemyZone = function(board, turn, moveAction, currentMoveCount, currentCaptured) {
    let dst = moveAction.calculateDestination(turn);
    let src = moveAction.getSource();
    let srcSquare = board.getSquareAt(src[0], src[1]);
    let srcPiece = srcSquare.getOccupyingPiece();
    if (srcPiece.getName() === '步' || srcPiece.getName() === '香')
        if (turn === 0 && dst[0] === 0)
            return PromotionRule.MUST;
        else if (turn === 1 && dst[0] === 8)
            return PromotionRule.MUST;
    if (srcPiece.getName() === '桂')
        if (turn === 0 && dst[0] <= 1)
            return PromotionRule.MUST;
        else if (turn === 1 && dst[0] >= 7)
            return PromotionRule.MUST;
        
    return PromotionRule.ABLE;
}

HON_PROMOTIONRULE.isPromotableFromEnemyZone = function(board, turn, moveAction, currentMoveCount, currentCaptured) {
    let dst = moveAction.calculateDestination(turn);
    let src = moveAction.getSource();
    let srcSquare = board.getSquareAt(src[0], src[1]);
    let srcPiece = srcSquare.getOccupyingPiece();
    if (srcPiece.getName() === '步' || srcPiece.getName() === '香')
        if (turn === 0 && dst[0] === 0)
            return PromotionRule.MUST;
        else if (turn === 1 && dst[0] === 8)
            return PromotionRule.MUST;
    if (srcPiece.getName() === '桂')
        if (turn === 0 && dst[0] <= 1)
            return PromotionRule.MUST;
        else if (turn === 1 && dst[0] >= 7)
            return PromotionRule.MUST;
        
    return PromotionRule.ABLE;
}

HON_PROMOTIONRULE.isPromotableOnCapture = function() {
    return PromotionRule.NO;
}

const HON_AFTERRULE = new AfterRule();

let honGame = new Game(honBoard, 2, new RuleSet(HON_CAPTURERULE, HON_DROPRULE, HON_PROMOTIONRULE, HON_AFTERRULE), HON_POOL);

function sleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function printBoard() {
    let lastAction = honGame.getLastAction();
    let lastPos = honGame.getLastPos();
    let from = [-1, -1], to = [-1, -1];
    let fromColor = '\x1b[0m', toColor = '\x1b[0m';

    function getOwnerColor(i, j) {
        let srcSquare = honGame.getSquareAt(i, j);
        if (!srcSquare.isOccupied())
            return '\x1b[0m';
        else return srcSquare.getOccupyingPiece().getOwner() ? '\x1b[32m' : '\x1b[33m';
    }

    function getOwnerPromotedColor(i, j) {
        let srcSquare = honGame.getSquareAt(i, j);
        if (!srcSquare.isOccupied())
            return '\x1b[0m';
        else return srcSquare.getOccupyingPiece().getOwner() ? '\x1b[31m' : '\x1b[91m';
    }

    if (lastAction === null)
        return;

    switch (lastAction.constructor) {
        case MoveAction:
            from = lastPos[0];
            fromColor = '\x1b[94m';
            to = lastPos[1];
            toColor = '\x1b[34m';
            break;
        case DropAction:
            from = lastPos[0];
            fromColor = honGame.getTurn() ? '\x1b[35m' : '\x1b[95m';
    }

    console.clear();
    console.log(Array(9).fill().map((_, i) => Array(9).fill().map((__, j) => {
        let color = getOwnerColor(i, j);
        let square = honBoard.getSquareAt(i, j);
        if (square.isOccupied() && square.getOccupyingPiece().isPromoted())
            color = getOwnerPromotedColor(i, j);
        
        if (from[0] === i && from[1] === j)
            color = fromColor;
        if (to[0] === i && to[1] === j)
            color = toColor;
        return `${color}${square.isOccupied() ? square.getOccupyingPiece().getName() : '無'}\x1b[0m`;
    }).join('')).join('\n'));

    sleep(500);
}

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

let sente = new HookedPlayer();
let gote = new HookedPlayer();

honGame.addParticipant(sente, 0);
honGame.addParticipant(gote, 1);

let WINNER = -1;
let ACTED = false;

function auto() {
    ACTED = false;
    if (Math.floor(Math.random() * 10) <= 2 && honGame.getTurnParticipant().getGrave().getPieceCount() > 0)
        autoDrop();
    if (!ACTED)
        autoMove();
    if (ACTED === false)
        console.error('STALEMATE');
}

function autoDrop() {
    let turn = honGame.getTurn();
    let player = honGame.getTurnParticipant();
    let available = honGame.getAvailableDrops(turn);
    if (available.length !== 0) {
        ACTED = true;
        let selected = available[Math.floor(Math.random() * available.length)];
        player.drop(honGame, selected.getPiece(), selected.getDestination());
    }
}

function autoMove() {
    let turn = honGame.getTurn();
    let player = honGame.getTurnParticipant();
    let available = [];
    if (honGame.currentMoveCount() > 0)
        available.push(...honGame.getAvailablableMoves(honGame.getLastAction().calculateDestination(turn)));
    else
        for (let i = 0; i < 9; i++)
            for (let j = 0; j < 9; j++) {
                let srcSquare = honGame.getSquareAt(i, j);
                if (srcSquare.isOccupied() && srcSquare.getOccupyingPiece().getOwner() === turn)
                    available.push(...honGame.getAvailablableMoves([i, j]));
            }
    if (available.length !== 0) {
        ACTED = true;
        let selected = available[Math.floor(Math.random() * available.length)];
        player.move(honGame, selected.getSource(), selected.getMovement(), selected.getDirection(), selected.getDistance());
    }

    if (player.hasPromotionRequest())
        player.promote(honGame, true);
    
    if (honGame.getBoard().royalElliminated(0)) {
        WINNER = 1;
    } else if (honGame.getBoard().royalElliminated(1)) {
        WINNER = 0;
    }
}

do {
    auto();
} while (WINNER == -1);

console.log(`THE WINNER IS ${WINNER ? 'GOTE' : 'SENTE'}`);
console.timeEnd('random-game');

/*
sente.move(honGame, [9, 5], Movement.DOUBLE, Direction16.N);
gote.move(honGame, [2, 6], Movement.DOUBLE, Direction16.N);
sente.move(honGame, [8, 4], Movement.STEP, Direction8.N);
gote.move(honGame, [3, 7], Movement.STEP, Direction8.N);
sente.move(honGame, [7, 5], Movement.LION, Direction8.NE);
sente.move(honGame, [6, 6], Movement.LION, Direction8.P);
gote.move(honGame, [4, 6], Movement.DOUBLE, Direction16.N); // LION CANNOT CAPTURE PROTECTED LION
gote.move(honGame, [4, 3], Movement.STEP, Direction8.N);
sente.move(honGame, [8, 5], Movement.STEP, Direction8.N);
gote.move(honGame, [4, 6], Movement.DOUBLE, Direction16.N); // CAPTURABLE, BECAUSE PAWN BLOCKED THE HORSE PROTECTING THE LION
sente.move(honGame, [7, 5], Movement.STEP, Direction8.N);
gote.move(honGame, [2, 8], Movement.RANGE, Direction8.NE, 5);
sente.move(honGame, [6, 5], Movement.STEP, Direction8.N);
gote.move(honGame, [7, 3], Movement.RANGE, Direction8.NW, 3);
gote.promote(honGame, true); // ACCEPT PROMOTION FROM HORSE TO EAGLE
*/