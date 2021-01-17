import PieceConfig from '../src/config/PieceConfig.js';
import MoveAction from '../src/game/action/MoveAction.js';
import Board from '../src/game/Board.js';
import Game from '../src/game/Game.js';
import Direction16 from '../src/game/movement/Direction16.js';
import Direction8 from '../src/game/movement/Direction8.js';
import DirectionL from '../src/game/movement/DirectionL.js';
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
const STANDARD16 = Direction16.STANDARD;
const ROOK = Direction8.ROOK;
const N = Direction8.N;
const S = Direction8.S;
const NS = [N, S];
const ND = [Direction8.NE, Direction8.NW];
const SD = [Direction8.SE, Direction8.SW];
const EW = [Direction8.E, Direction8.W];
const ROOK16 = Direction16.ROOK;
const BISHOP = Direction8.BISHOP;
const BISHOP16 = Direction16.BISHOP;

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

function LION(arr) {
    return arr.map(e => [Movement.LION, e]);
}

function SLION3(arr) {
    return arr.map(e => [Movement.SLION3, e]);
}

function CJUMP(arr) {
    return arr.map(e => [Movement.CJUMP, e]);
}

function LRANGE(arr, from, to) {
    return arr.map(e => [Movement.LRANGE, new DirectionL(e, to, from)]);
}

function IGUI(arr) {
    return arr.map(e => [Movement.IGUI, e]);
}
 
const TENJIKU_POOL = new Map(Object.entries({
    '麒': new PieceConfig(DOUBLE(ROOK16).concat(STEP(BISHOP)), '獅'),
    '獅': new PieceConfig(DOUBLE(STANDARD16).concat(LION([Direction8.K])), '師'),
    '師': new PieceConfig(DOUBLE(STANDARD16).concat(LION([Direction8.K])).concat(RANGE(BISHOP))),
    '鳳': new PieceConfig(DOUBLE(BISHOP16).concat(STEP(ROOK)), '奔'),
    '奔': new PieceConfig(RANGE(STANDARD), '就'),
    '就': new PieceConfig(RANGE(STANDARD).concat(LION([Direction8.B]))),
    '步': new PieceConfig(STEP([N]), '金'),
    '金': new PieceConfig(STEP(ROOK.concat(ND)), '飛'),
    '飛': new PieceConfig(RANGE(ROOK), '龍'),
    '龍': new PieceConfig(RANGE(ROOK).concat(STEP(BISHOP)), '鷲'),
    '鷲': new PieceConfig(RANGE(ROOK).concat(LION(ND)).concat(RANGE(SD)), '升'),
    '升': new PieceConfig(RANGE(ROOK).concat(CJUMP(ROOK)), '大', false, 0),
    '大': new PieceConfig(RANGE(STANDARD).concat(CJUMP(STANDARD)), '', false, 2),
    '豹': new PieceConfig(STEP(BISHOP.concat(NS)), '角'),
    '角': new PieceConfig(RANGE(BISHOP), '馬'),
    '馬': new PieceConfig(RANGE(BISHOP).concat(STEP(ROOK)), '鷹'),
    '鷹': new PieceConfig(RANGE(BISHOP).concat(STEP(ROOK.filter(e => e !== N))).concat(LION([N])), '用'),
    '用': new PieceConfig(RANGE(BISHOP).concat(CJUMP(BISHOP)), '副', false, 0),
    '副': new PieceConfig(RANGE(BISHOP).concat(CJUMP(BISHOP)).concat(SLION3([Direction8.K])), '', false, 1),
    '銀': new PieceConfig(STEP(BISHOP.concat([N])), '竪'),
    '竪': new PieceConfig(RANGE(NS).concat(STEP(EW)), '牛'),
    '牛': new PieceConfig(RANGE(BISHOP.concat(NS))),
    '銅': new PieceConfig(STEP(NS.concat(ND)), '橫'),
    '橫': new PieceConfig(RANGE(EW).concat(STEP(NS)), '猪'),
    '猪': new PieceConfig(RANGE(BISHOP.concat(EW))),
    '鉄': new PieceConfig(STEP(ND.concat([N]), '立')),
    '立': new PieceConfig(RANGE([N]).concat(LRANGE(EW, 1, 2)).concat(STEP([S])), '車'),
    '車': new PieceConfig(RANGE(BISHOP.concat(NS)).concat(LRANGE(EW, 1, 2))),
    '天': new PieceConfig(IGUI(STANDARD).concat(LRANGE(BISHOP.concat(NS), 2, Infinity)).concat(LRANGE(EW, 2, 3))),
    '桂': new PieceConfig(DOUBLE([Direction16.NNE, Direction16.NNW]), '黄'),
    '黄': new PieceConfig(RANGE(EW).concat(LRANGE([N], 1, 2)).concat(STEP([S])), '水'),
    '水': new PieceConfig(RANGE(BISHOP.concat(EW)).concat(LRANGE(NS, 1, 2)), '火'),
    '火': new PieceConfig(RANGE(BISHOP.concat(EW)).concat(SLION3([Direction8.K]))),
    '反': new PieceConfig(RANGE(NS), '鯨'),
    '鯨': new PieceConfig(RANGE(NS.concat(SD))),
    '香': new PieceConfig(RANGE([N]), '駒'),
    '駒': new PieceConfig(RANGE(NS.concat(ND))),
    '虎': new PieceConfig(STEP(STANDARD.filter(e => e !== N)), '鹿'),
    '鹿': new PieceConfig(RANGE(NS).concat(STEP(BISHOP))),
    '犬': new PieceConfig(STEP(SD.concat([N])), '象'),
    '雜': new PieceConfig(RANGE(SD.concat([N]))),
    '象': new PieceConfig(STEP(STANDARD.filter(e => e !== S)), '太'),
    '子': new PieceConfig(STEP(STANDARD), '', true, 3),
    '玉': new PieceConfig(STEP(STANDARD), '', true, 3),
    '王': new PieceConfig(STEP(STANDARD), '', true, 3),
}));

const ZONE =
`2222222222222222
2222222222222222
2222222222222222
2222222222222222
2222222222222222
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111`.split('\n');

const OWNER =
`2222222222222222
2022022222202202
2222222222222222
2222222222222222
2222222222222222
0000200000020000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000100000010000
1111111111111111
1111111111111111
1111111111111111
1011011111101101
1111111111111111`.split('\n');

const SETUP =
`香桂豹鉄銅銀金象王金銀銅鉄豹桂香
反無車車無虎鳳奔獅麒虎無車車無反
橫竪角馬龍水火就師火水龍馬角竪橫
橫竪飛鷹鷲用升副大升用鷲鷹飛竪橫
步步步步步步步步步步步步步步步步
無無無無犬無無無無無無犬無無無無
無無無無無無無無無無無無無無無無
無無無無無無無無無無無無無無無無
無無無無無無無無無無無無無無無無
無無無無無無無無無無無無無無無無
無無無無犬無無無無無無犬無無無無
步步步步步步步步步步步步步步步步
橫竪飛鷹鷲用升大副升用鷲鷹飛竪橫
橫竪角馬龍水火師就火水龍馬角竪橫
反無車車無虎麒獅奔鳳虎無車車無反
香桂豹鉄銅銀金玉象金銀銅鉄豹桂香`.split('\n');

let tenjikuBoard = new Board(16, 16);

for (let i = 0; i < 16; i++)
    for (let j = 0; j < 16; j++) {
        let square = new Square(parseInt(ZONE[i][j]) - 1);
        let owner = OWNER[i][j];
        
        if (owner !== '0') {
            let name = SETUP[i][j];
            let config = TENJIKU_POOL.get(name);
            square.occupy(new Piece(name, parseInt(owner) - 1, config.movePowers, false, config.promotesTo, name, config.isKing, config.generalRank, config.noSuicide));
        }

        tenjikuBoard.setSquareAt(i, j, square);
    }

const TENJIKU_CAPTURERULE = new CaptureRule();

TENJIKU_CAPTURERULE.isCapturable = function(board, turn, moveAction, previousTerminalCapture, currentMoveCount, currentCaptured) {
    let src = moveAction.getSource();
    let srcSquare = board.getSquareAt(src[0], src[1]);
    let capturing = srcSquare.getOccupyingPiece();
    let dst = moveAction.calculateDestination(turn);
    let dstSquare = board.getSquareAt(dst[0], dst[1]);
    let captured = dstSquare.getOccupyingPiece();
    if (['用', '升', '副', '大'].includes(capturing.getName()) && moveAction.getMovement() === Movement.CJUMP && captured.isKing())
        return false;
    return true;
}

const TENJIKU_DROPRULE = new DropRule();

TENJIKU_DROPRULE.isDroppable = function() {
    return false;
}

const TENJIKU_PROMOTIONRULE = new PromotionRule();

TENJIKU_PROMOTIONRULE.isPromotableEnteringEnemyZone = function() {
    return PromotionRule.ABLE;
}

TENJIKU_PROMOTIONRULE.isPromotableFromEnemyZone = function(board, turn, moveAction, currentMoveCount, currentCaptured) {
    let dst = moveAction.calculateDestination(turn);
    let src = moveAction.getSource();
    let srcSquare = board.getSquareAt(src[0], src[1]);
    let srcPiece = srcSquare.getOccupyingPiece();
    if (srcPiece.getName() === '鉄')
        if (turn === 0 && dst[0] === 0)
            return PromotionRule.ABLE;
        else if (turn === 1 && dst[0] === 15)
            return PromotionRule.ABLE;
    if (srcPiece.getName() === '桂')
        if (turn === 0 && dst[0] <= 1)
            return PromotionRule.ABLE;
        else if (turn === 1 && dst[0] >= 14)
            return PromotionRule.ABLE;
    return (board.getSquareAt(dst[0], dst[1]).isOccupied()) ? PromotionRule.ABLE : PromotionRule.NO;
}

TENJIKU_PROMOTIONRULE.isPromotableOnCapture = function() {
    return PromotionRule.NO;
}

const TENJIKU_AFTERRULE = new AfterRule();

TENJIKU_AFTERRULE.onAfterMove = function(board, turn, moveAction, currentMoveCount, currentCaptured) {
    let loc = (moveAction.getMovement() === Movement.IGUI) ? moveAction.getSource() : moveAction.calculateDestination(turn);
    let square = board.getSquareAt(loc[0], loc[1]);
    let piece = square.getOccupyingPiece();
    let burnt = false;

    for (let dir of STANDARD) {
        let dst = new MoveAction(null, loc, Movement.STEP, dir).calculateDestination(turn);
        if (!board.has(dst[0], dst[1]))
            continue;
        let dstSquare = board.getSquareAt(dst[0], dst[1]);
        if (dstSquare.isOccupied() && dstSquare.getOccupyingPiece().getOwner() !== turn && dstSquare.getOccupyingPiece().getName() === '火') {
            let originalName = piece.getOriginalName();
            let originalConfig = TENJIKU_POOL.get(originalName);
            let owner = dstSquare.getOccupyingPiece().getOwner();
            tenjikuGame.getParticipant(owner)
                .capture(new Piece(originalName, owner, originalConfig.movePowers, false, originalConfig.promotesTo, originalName,
                originalConfig.isKing, originalConfig.generalRank, originalConfig.noSuicide));
            square.vacate();
            burnt = true;
        }
    }

    if (!burnt && piece.getName() === '火')
        for (let dir of STANDARD) {
            let dst = new MoveAction(null, loc, Movement.STEP, dir).calculateDestination(turn);
            if (!board.has(dst[0], dst[1]))
                continue;
            let dstSquare = board.getSquareAt(dst[0], dst[1]);
            if (dstSquare.isOccupied() && dstSquare.getOccupyingPiece().getOwner() !== turn) {
                let dstPiece = dstSquare.getOccupyingPiece();
                let originalName = dstPiece.getOriginalName();
                let originalConfig = TENJIKU_POOL.get(originalName);
                moveAction.getPlayer().capture(new Piece(originalName, turn, originalConfig.movePowers, false, originalConfig.promotesTo, originalName,
                    originalConfig.isKing, originalConfig.generalRank, originalConfig.noSuicide));
                dstSquare.vacate();
            }
        }
}

let tenjikuGame = new Game(tenjikuBoard, 2, new RuleSet(TENJIKU_CAPTURERULE, TENJIKU_DROPRULE, TENJIKU_PROMOTIONRULE, TENJIKU_AFTERRULE), TENJIKU_POOL);

function sleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function printBoard() {
    let lastAction = tenjikuGame.getLastAction();
    let lastPos = tenjikuGame.getLastPos();
    let from = [-1, -1], to = [-1, -1];
    let fromColor = '\x1b[0m', toColor = '\x1b[0m';

    function getOwnerColor(i, j) {
        let srcSquare = tenjikuGame.getSquareAt(i, j);
        if (!srcSquare.isOccupied())
            return '\x1b[0m';
        else return srcSquare.getOccupyingPiece().getOwner() ? '\x1b[32m' : '\x1b[33m';
    }

    function getOwnerPromotedColor(i, j) {
        let srcSquare = tenjikuGame.getSquareAt(i, j);
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
    }

    console.clear();
    console.log(Array(16).fill().map((_, i) => Array(16).fill().map((__, j) => {
        let color = getOwnerColor(i, j);
        let square = tenjikuBoard.getSquareAt(i, j);
        if (square.isOccupied() && square.getOccupyingPiece().isPromoted())
            color = getOwnerPromotedColor(i, j);
        
        if (from[0] === i && from[1] === j)
            color = fromColor;
        if (to[0] === i && to[1] === j)
            color = toColor;
        return `${color}${square.isOccupied() ? square.getOccupyingPiece().getName() : '無'}\x1b[0m`;
    }).join('')).join('\n'));

    sleep(100);
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

    onInvalidAction(game, action) {
        console.log('INVALID');
        sleep(10000);
    }
}

let sente = new HookedPlayer();
let gote = new HookedPlayer();

tenjikuGame.addParticipant(sente, 0);
tenjikuGame.addParticipant(gote, 1);

let WINNER = -1;

function autoMove() {
    let turn = tenjikuGame.getTurn();
    let player = tenjikuGame.getTurnParticipant();
    let available = [];
    if (tenjikuGame.currentMoveCount() > 0)
        available.push(...tenjikuGame.getAvailablableMoves(tenjikuGame.getLastAction().calculateDestination(turn)));
    else
        for (let i = 0; i < 16; i++)
            for (let j = 0; j < 16; j++) {
                let srcSquare = tenjikuGame.getSquareAt(i, j);
                if (srcSquare.isOccupied() && srcSquare.getOccupyingPiece().getOwner() === turn)
                    available.push(...tenjikuGame.getAvailablableMoves([i, j]));
            }
    if (available.length === 0)
        console.error('STALEMATE');
    else {
        let selected = available[Math.floor(Math.random() * available.length)];
        player.move(tenjikuGame, selected.getSource(), selected.getMovement(), selected.getDirection(), selected.getDistance());
    }

    if (player.hasPromotionRequest())
        player.promote(tenjikuGame, true);
    
    if (tenjikuGame.getBoard().royalElliminated(0)) {
        WINNER = 1;
    } else if (tenjikuGame.getBoard().royalElliminated(1)) {
        WINNER = 0;
    }
}

do {
    autoMove();
} while (WINNER == -1);

console.log(`THE WINNER IS ${WINNER ? 'GOTE' : 'SENTE'}`);
console.timeEnd('random-game');



/*
sente.move(tenjikuGame, [9, 5], Movement.DOUBLE, Direction16.N);
gote.move(tenjikuGame, [2, 6], Movement.DOUBLE, Direction16.N);
sente.move(tenjikuGame, [8, 4], Movement.STEP, Direction8.N);
gote.move(tenjikuGame, [3, 7], Movement.STEP, Direction8.N);
sente.move(tenjikuGame, [7, 5], Movement.LION, Direction8.NE);
sente.move(tenjikuGame, [6, 6], Movement.LION, Direction8.P);
gote.move(tenjikuGame, [4, 6], Movement.DOUBLE, Direction16.N); // LION CANNOT CAPTURE PROTECTED LION
gote.move(tenjikuGame, [4, 3], Movement.STEP, Direction8.N);
sente.move(tenjikuGame, [8, 5], Movement.STEP, Direction8.N);
gote.move(tenjikuGame, [4, 6], Movement.DOUBLE, Direction16.N); // CAPTURABLE, BECAUSE PAWN BLOCKED THE HORSE PROTECTING THE LION
sente.move(tenjikuGame, [7, 5], Movement.STEP, Direction8.N);
gote.move(tenjikuGame, [2, 8], Movement.RANGE, Direction8.NE, 5);
sente.move(tenjikuGame, [6, 5], Movement.STEP, Direction8.N);
gote.move(tenjikuGame, [7, 3], Movement.RANGE, Direction8.NW, 3);
gote.promote(tenjikuGame, true); // ACCEPT PROMOTION FROM HORSE TO EAGLE
*/