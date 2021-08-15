import {JSDOM} from 'jsdom';
import Game from '../assets/js/classes/Game.js';
import Board from '../assets/js/classes/Board.js';
import Players from '../assets/js/classes/Players.js';
jest.mock('../assets/js/classes/Board');
jest.mock('../assets/js/classes/Players');
jest.useFakeTimers()

describe('Game class', () => {
    beforeEach(() => {
        const dom = new JSDOM();
        global.window = dom.window;
        global.document = dom.window.document;

        Game.newGameButton = document.createElement('button');
        Game.newGameButton.className = 'new-game-button';
        document.body.appendChild(Game.newGameButton);
    });

    afterEach(() => jest.restoreAllMocks());

    it('initializes', () => {
        // Mock
        jest
            .spyOn(global.document, 'addEventListener')
            .mockImplementation(() => {});
        jest
            .spyOn(Game.prototype, 'startNewGame')
            .mockImplementation(() => {});

        // Setup
        const game = new Game();
        game.newGameButton.click();
        game.newGameButton.click();

        // Verify
        expect(Board).toHaveBeenCalledWith(game);
        expect(game.startNewGame).toHaveBeenCalledTimes(3);
    });

    it('starts a new game', () => {
        // Setup
        const game = new Game();
        game.winner = true;
        game.players.currentPlayer = game.player2;
        game.startNewGame();

        // Verify
        expect(game.winner).toEqual(false);
        expect(game.players.currentPlayer).toEqual(game.player1);
        expect(game.board.reset).toHaveBeenCalled();
    });

    it('tells us there was a winner', () => {
         // Mock
        jest
            .spyOn(global.window, 'alert')
            .mockImplementation(() => {});

        // Setup
        const game = new Game();
        game.players.currentPlayer = game.players.player2;
        game.winner = false;
        game.alertWinner();
        jest.runAllTimers();

        // Verify
        expect(game.winner).toEqual(true);
        expect(global.window.alert).toHaveBeenCalledWith(game.players.player2 + ' Wins!');
    });

    it('tells us there was a Tie', () => {
         // Mock
        jest
            .spyOn(global.window, 'alert')
            .mockImplementation(() => {});

        // Setup
        const game = new Game();
        game.players.currentPlayer = game.players.player2;
        game.alertTie();
        jest.runAllTimers();

        // Verify
        expect(global.window.alert)
            .toHaveBeenCalledWith(game.players.player1 + ' and ' + game.players.player2 + ' Tie');
    });

    it('detects there was a winner', () => {
         // Mock
        jest
            .spyOn(Board.prototype, 'getCurrentState')
            .mockImplementation(() => {
                return ['X', 'X', 'X',
                        '', '', '',
                        '', '', ''];
            });
        jest
            .spyOn(Game.prototype, 'alertWinner')
            .mockImplementation(() => {});

        // Setup
        const game = new Game();
        game.checkForWinners();

        // Verify
        expect(game.alertWinner).toHaveBeenCalled();
    });

    it('detects there was a tie', () => {
         // Mock
        jest
            .spyOn(Board.prototype, 'getCurrentState')
            .mockImplementation(() => {
                return ['X', 'O', 'X',
                        'X', 'X', 'O',
                        'O', 'X', 'O'];
            });
        jest
            .spyOn(Board.prototype, 'isFull')
            .mockImplementation(() => true);
        jest
            .spyOn(Game.prototype, 'alertTie')
            .mockImplementation(() => {});

        // Setup
        const game = new Game();
        game.checkForWinners();

        // Verify
        expect(game.alertTie).toHaveBeenCalled();
    });
});
