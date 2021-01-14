import PieceConfig from '../../src/config/PieceConfig.js';
import Board from '../../src/game/Board.js';
import Game from '../../src/game/Game.js';
import Direction16 from '../../src/game/movement/Direction16.js';
import Direction8 from '../../src/game/movement/Direction8.js';
import Movement from '../../src/game/movement/Movement.js';
import Piece from '../../src/game/Piece.js';
import Player from '../../src/game/Player.js';
import CaptureRule from '../../src/game/rule/CaptureRule.js';
import DropRule from '../../src/game/rule/DropRule.js';
import PromotionRule from '../../src/game/rule/PromotionRule.js';
import RuleSet from '../../src/game/rule/RuleSet.js';
import Square from '../../src/game/Square.js';

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

const CHU_POOL = new Map(Object.entries({
    '麒': new PieceConfig(DOUBLE(ROOK16).concat(STEP(BISHOP)), '獅'),
    '獅': new PieceConfig(DOUBLE(STANDARD16).concat(LION([Direction8.K]))),
    '鳳': new PieceConfig(DOUBLE(BISHOP16).concat(STEP(ROOK)), '奔'),
    '奔': new PieceConfig(RANGE(STANDARD)),
    '步': new PieceConfig(STEP([N]), '金'),
    '金': new PieceConfig(STEP(ROOK.concat(ND)), '飛'),
    '飛': new PieceConfig(RANGE(ROOK), '龍'),
    '龍': new PieceConfig(RANGE(ROOK).concat(STEP(BISHOP)), '鷲'),
    '鷲': new PieceConfig(RANGE(ROOK).concat(LION(ND)).concat(RANGE(SD))),
    '豹': new PieceConfig(STEP(BISHOP.concat(NS)), '角'),
    '角': new PieceConfig(RANGE(BISHOP), '馬'),
    '馬': new PieceConfig(RANGE(BISHOP).concat(STEP(ROOK)), '鷹'),
    '鷹': new PieceConfig(RANGE(BISHOP).concat(STEP(ROOK.filter(e => e !== N))).concat(LION([N]))),
    '銀': new PieceConfig(STEP(BISHOP.concat([N])), '竪'),
    '竪': new PieceConfig(RANGE(NS).concat(STEP(EW)), '牛'),
    '牛': new PieceConfig(RANGE(BISHOP.concat(NS))),
    '銅': new PieceConfig(STEP(NS.concat(ND)), '橫'),
    '橫': new PieceConfig(RANGE(EW).concat(STEP(NS)), '猪'),
    '猪': new PieceConfig(RANGE(BISHOP.concat(EW))),
    '反': new PieceConfig(RANGE(NS), '鯨'),
    '鯨': new PieceConfig(RANGE(NS.concat(SD))),
    '香': new PieceConfig(RANGE([N]), '駒'),
    '駒': new PieceConfig(RANGE(NS.concat(ND))),
    '虎': new PieceConfig(STEP(STANDARD.filter(e => e !== N)), '鹿'),
    '鹿': new PieceConfig(RANGE(NS).concat(STEP(BISHOP))),
    '仲': new PieceConfig(STEP(NS), '象'),
    '象': new PieceConfig(STEP(STANDARD.filter(e => e !== S)), '太'),
    '太': new PieceConfig(STEP(STANDARD), '', true),
    '玉': new PieceConfig(STEP(STANDARD), '', true),
    '王': new PieceConfig(STEP(STANDARD), '', true)
}));

const ZONE =
`222222222222
222222222222
222222222222
222222222222
000000000000
000000000000
000000000000
000000000000
111111111111
111111111111
111111111111
111111111111`.split('\n');

const OWNER =
`222222222222
202022220202
222222222222
222222222222
000200002000
000000000000
000000000000
000100001000
111111111111
111111111111
101011110101
111111111111`.split('\n');

const SETUP =
`香豹銅銀金象王金銀銅豹香
反無角無虎鳳麒虎無角無反
橫竪飛馬龍奔獅龍馬飛竪橫
步步步步步步步步步步步步
無無無仲無無無無仲無無無
無無無無無無無無無無無無
無無無無無無無無無無無無
無無無仲無無無無仲無無無
步步步步步步步步步步步步
橫竪飛馬龍獅奔龍馬飛竪橫
反無角無虎麒鳳虎無角無反
香豹銅銀金玉象金銀銅豹香`.split('\n');

let chuBoard = new Board(12, 12);

function printBoard() {
    console.log(Array(12).fill().map((_, i) => Array(12).fill().map((__, j) => {
        let square = chuBoard.getSquareAt(i, j);
        return square.isOccupied() ? square.getOccupyingPiece().getName() : '無';
    }).join('')).join('\n'))
}

for (let i = 0; i < 12; i++)
    for (let j = 0; j < 12; j++) {
        let square = new Square(parseInt(ZONE[i][j]) - 1);
        let owner = OWNER[i][j];
        
        if (owner !== '0') {
            let name = SETUP[i][j];
            let config = CHU_POOL.get(name);
            square.occupy(new Piece(name, parseInt(owner) - 1, config.movePowers, false, config.promotesTo, null, config.isKing));
        }

        chuBoard.setSquareAt(i, j, square);
    }

const CHU_CAPTURERULE = new CaptureRule();

CHU_CAPTURERULE.isCapturable = function(board, turn, moveAction, previousTerminalCapture) {
    let src = moveAction.getSource();
    let srcSquare = board.getSquareAt(src[0], src[1]);
    let capturing = srcSquare.getOccupyingPiece();
    let dst = moveAction.calculateDestination(turn);
    let dstSquare = board.getSquareAt(dst[0], dst[1]);
    let captured = board.getSquareAt(dstSquare).getOccupyingPiece();
    if (captured.getName() !== '獅')
        return true;

    if (capturing.getName() === '獅') {
        if (moveAction.getMoveCount() === 0 || moveAction.getPreviousCaptured().some(e => !['步', '中'].includes(e.getName())))
            return true;
        // virtual eat
        srcSquare.vacate();
        let prot = board.isProtectedBy(dst, 1 - turn);
        srcSquare.occupy(capturing);
        return !prot;
    } else
        return previousTerminalCapture === null
            || previousTerminalCapture[3].getName() === '獅' || previousTerminalCapture[4].getName() !== '獅';
}

const CHU_DROPRULE = new DropRule();

CHU_DROPRULE.isDroppable = function() {
    return false;
}

const CHU_PROMOTIONRULE = new PromotionRule();

CHU_PROMOTIONRULE.isPromotableEnteringEnemyZone = function() {
    return PromotionRule.ABLE;
}

CHU_PROMOTIONRULE.isPromotableFromEnemyZone = function(board, turn, moveAction) {
    let dst = moveAction.calculateDestination(turn);
    return (board.getSquareAt(dst[0], dst[1]).isOccupied()) ? PromotionRule.ABLE : PromotionRule.NO;
}

CHU_PROMOTIONRULE.isPromotableOnCapture = function() {
    return PromotionRule.NO;
}

CHU_PROMOTIONRULE.isPromotableOnStuck = function(board, turn, moveAction) {
    return board.getSquareAt(src[0], src[1]).getOccupyingPiece().name === '步' ? PromotionRule.ABLE : PromotionRule.NO;
}

let chuGame = new Game(chuBoard, 2, new RuleSet(CHU_CAPTURERULE, CHU_DROPRULE, CHU_PROMOTIONRULE), CHU_POOL);
let sente = new Player();
let gote = new Player();
chuGame.addParticipant(sente, 0);
chuGame.addParticipant(gote, 1);

sente.move(chuGame, [9, 5], Movement.DOUBLE, Direction16.N);

printBoard();