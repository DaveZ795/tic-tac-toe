import {JSDOM} from 'jsdom';
import Board from '../assets/js/classes/Board.js';

describe('Board class', () => {
    beforeEach(() => {
        const dom = new JSDOM();
        global.window = dom.window;
        global.document = dom.window.document;

        Board.square = document.createElement('button');
        Board.square.className = 'board__square';
        Board.square.dataset.squareNumber = '3';
        document.body.appendChild(Board.square);
    });

    afterEach(() => jest.restoreAllMocks());

    it('initializes', () => {
        // Mock
        jest
            .spyOn(global.document, 'addEventListener')
            .mockImplementation(() => {});
        jest
            .spyOn(Board.prototype, 'handleSquareMouseOver')
            .mockImplementation(() => {});
        jest
            .spyOn(Board.prototype, 'handleSquareMouseOut')
            .mockImplementation(() => {});
         jest
            .spyOn(Board.prototype, 'handleSquareClick')
            .mockImplementation(() => {});

        // Setup
        const board = new Board('foo');
        var mouseOverEvent = new global.window.MouseEvent('mouseover', {
          'view': global.window,
          'bubbles': true,
          'cancelable': true
        });
        board.domSquares[0].dispatchEvent(mouseOverEvent);
        var mouseOutEvent = new global.window.MouseEvent('mouseout', {
          'view': global.window,
          'bubbles': true,
          'cancelable': true
        });
        board.domSquares[0].dispatchEvent(mouseOutEvent);
        board.domSquares[0].click();

        // Verify
        expect(board.game).toEqual('foo');
        expect(board.handleSquareMouseOver).toHaveBeenCalledTimes(1);
        expect(board.handleSquareMouseOut).toHaveBeenCalledTimes(1);
        expect(board.handleSquareClick).toHaveBeenCalledTimes(1);
    });

    it('handles hovering over a square when allowed', () => {
        // Mock
        jest
            .spyOn(Board.prototype, 'canInteractWithSquare')
            .mockImplementation(() => true);

        // Setup
        const board = new Board({players: {currentPlayer: 'X'}});
        board.handleSquareMouseOver(board.domSquares[0]);

        // Verify
        expect(board.domSquares[0].classList.contains('board__square--preview')).toEqual(true);
        expect(board.domSquares[0].textContent).toEqual('X');
    });

    it('handles hovering over a square when not allowed', () => {
        // Mock
        jest
            .spyOn(Board.prototype, 'canInteractWithSquare')
            .mockImplementation(() => false);

        // Setup
        const board = new Board({players: {currentPlayer: 'X'}});
        board.handleSquareMouseOver(board.domSquares[0]);

        // Verify
        expect(board.domSquares[0].classList.contains('board__square--preview')).toEqual(false);
        expect(board.domSquares[0].textContent).not.toEqual('X');
    });

    it('handles mouseout on a square when allowed', () => {
        // Mock
        jest
            .spyOn(Board.prototype, 'canInteractWithSquare')
            .mockImplementation(() => true);

        // Setup
        const board = new Board({players: {currentPlayer: 'X'}});
        board.domSquares[0].classList.add('board__square--preview');
        board.domSquares[0].textContent = 'X';
        board.handleSquareMouseOut(board.domSquares[0]);

        // Verify
        expect(board.domSquares[0].classList.contains('board__square--preview')).toEqual(false);
        expect(board.domSquares[0].textContent).not.toEqual('X');
    });

    it('handles mouseout on a square when not allowed', () => {
        // Mock
        jest
            .spyOn(Board.prototype, 'canInteractWithSquare')
            .mockImplementation(() => false);

        // Setup
        const board = new Board({players: {currentPlayer: 'X'}});
        board.domSquares[0].classList.add('board__square--preview');
        board.domSquares[0].textContent = 'X';
        board.handleSquareMouseOut(board.domSquares[0]);

        // Verify
        expect(board.domSquares[0].classList.contains('board__square--preview')).toEqual(true);
        expect(board.domSquares[0].textContent).toEqual('X');
    });

    it('handles clicking on a square when allowed', () => {
        // Mock
        jest
            .spyOn(Board.prototype, 'canInteractWithSquare')
            .mockImplementation(() => true);
        jest
            .spyOn(Board.prototype, 'setSquare')
            .mockImplementation(() => {});

        const checkForWinners = jest.fn();
        const changeCurrentPlayer = jest.fn();

        // Setup
        const board = new Board({
            checkForWinners,
            players: {
                currentPlayer: 'X',
                changeCurrentPlayer
            }
        });
        board.domSquares[0].classList.add('board__square--preview');
        board.handleSquareClick(board.domSquares[0]);

        // Verify
        expect(board.domSquares[0].classList.contains('board__square--preview')).toEqual(false);
        expect(board.setSquare).toHaveBeenCalledWith(board.domSquares[0], 'X');
        expect(checkForWinners).toHaveBeenCalled();
        expect(changeCurrentPlayer).toHaveBeenCalled();
    });

    it('handles clicking on a square when not allowed', () => {
        // Mock
        jest
            .spyOn(Board.prototype, 'canInteractWithSquare')
            .mockImplementation(() => false);
        jest
            .spyOn(Board.prototype, 'setSquare')
            .mockImplementation(() => {});

        const checkForWinners = jest.fn();
        const changeCurrentPlayer = jest.fn();

        // Setup
        const board = new Board({
            checkForWinners,
            players: {
                currentPlayer: 'X',
                changeCurrentPlayer
            }
        });
        board.domSquares[0].classList.add('board__square--preview');
        board.handleSquareClick(board.domSquares[0]);

        // Verify
        expect(board.domSquares[0].classList.contains('board__square--preview')).toEqual(true);
        expect(board.setSquare).not.toHaveBeenCalled();
        expect(checkForWinners).not.toHaveBeenCalled();
        expect(changeCurrentPlayer).not.toHaveBeenCalled();
    });

    it('sets the value of a square', () => {
        // Mock
        jest
            .spyOn(Board.prototype, 'getSquareNumber')
            .mockImplementation(() => 0);

        // Setup
        const board = new Board();
        board.squares = ['X'];
        const setSquare = board.setSquare(board.domSquares[0], 'O');

        // Verify
        expect(board.squares[0]).toEqual('O');
        expect(board.domSquares[0].textContent).toEqual('O');
    });

    it('determines if a square is interactive without a winner and empty', () => {
        // Mock
        jest
            .spyOn(Board.prototype, 'getSquareNumber')
            .mockImplementation(() => 0);

        // Setup
        const board = new Board({winner: false});
        board.squares = [''];
        const canInteractWithSquare = board.canInteractWithSquare(board.domSquares[0]);

        // Verify
        expect(canInteractWithSquare).toEqual(true);
    });

    it('determines if a square is interactive with a winner but empty', () => {
        // Mock
        jest
            .spyOn(Board.prototype, 'getSquareNumber')
            .mockImplementation(() => 0);

        // Setup
        const board = new Board({winner: true});
        board.squares = [''];
        const canInteractWithSquare = board.canInteractWithSquare(board.domSquares[0]);

        // Verify
        expect(canInteractWithSquare).toEqual(false);
    });

    it('determines if a square is interactive without a winner and not empty', () => {
        // Mock
        jest
            .spyOn(Board.prototype, 'getSquareNumber')
            .mockImplementation(() => 0);

        // Setup
        const board = new Board({winner: false});
        board.squares = ['X'];
        const canInteractWithSquare = board.canInteractWithSquare(board.domSquares[0]);

        // Verify
        expect(canInteractWithSquare).toEqual(false);
    });

    it('tells us when not all squares are full', () => {
        // Setup
        const board = new Board();
        board.squares = [''];
        const isFull = board.isFull();

        // Verify
        expect(isFull).toEqual(false);
    });

    it('tells us when all squares are full', () => {
        // Setup
        const board = new Board();
        board.squares = ['X'];
        const isFull = board.isFull();

        // Verify
        expect(isFull).toEqual(true);
    });

    it('tells us the number of a square', () => {
        // Setup
        const board = new Board();
        const getSquareNumber = board.getSquareNumber(board.domSquares[0]);

        // Verify
        expect(getSquareNumber).toEqual('3');
    });

    it('tells us the state of all squares on the board', () => {
        // Setup
        const board = new Board();
        board.squares = ['X', 'O', ''];
        const getCurrentState = board.getCurrentState();

        // Verify
        expect(getCurrentState).toEqual(['X', 'O', '']);
    });

    it('clears off the board', () => {
        // Mock
        jest
            .spyOn(Board.prototype, 'setSquare')
            .mockImplementation(() => {});

        // Setup
        const board = new Board();
        board.reset();

        // Verify
        expect(board.setSquare).toHaveBeenCalled();
    });
});
