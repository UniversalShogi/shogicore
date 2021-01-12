import SquareConfig from '../config/SquareConfig';
import Board from './Board';
import Game from './Game';
import Piece from './Piece';
import RuleSetFactory from './rule/RuleSetFactory';
import Square from './Square';

export default class GameFactory {
    static get(gameConfig) {
        let boardConfig = gameConfig.boardConfig;
        let board = new Board(boardConfig.width, boardConfig.height);
        for (let i = 0; i < boardConfig.width; i++)
            for (let j = 0; j < boardConfig.height; j++) {
                let squareConfig = boardConfig.initialSquares[i][j];
                let square = new Square();
                if (squareConfig.name !== SquareConfig.BLANK)
                    square.occupy(new Piece(squareConfig.name, squareConfig.owner, gameConfig.piecePool.get(squareConfig.name)));
                board.setSquareAt(i, j, square);
            }
        return new Game(board, gameConfig.participantNumber, RuleSetFactory.get(gameConfig.captureRule, gameConfig.dropRule, gameConfig.promotionRule));
    }
}