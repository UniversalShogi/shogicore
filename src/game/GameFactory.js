import SquareConfig from '../config/SquareConfig.js';
import Board from './Board.js';
import Game from './Game.js';
import Piece from './Piece.js';
import RuleSetFactory from './rule/RuleSetFactory.js';
import Square from './Square.js';

export default class GameFactory {
    static get(gameConfig) {
        let boardConfig = gameConfig.boardConfig;
        let board = new Board(boardConfig.width, boardConfig.height);
        for (let i = 0; i < boardConfig.width; i++)
            for (let j = 0; j < boardConfig.height; j++) {
                let squareConfig = boardConfig.initialSquares[i][j];
                let square = new Square(squareConfig.zoneOwner - 1);
                if (squareConfig.name !== SquareConfig.BLANK)
                    square.occupy(new Piece(squareConfig.name, squareConfig.owner - 1, gameConfig.piecePool.get(squareConfig.name)));
                board.setSquareAt(i, j, square);
            }
        return new Game(board, gameConfig.participantNumber, RuleSetFactory.get(gameConfig.captureRules, gameConfig.dropRules, gameConfig.promotionRules), gameConfig.piecePool);
    }
}