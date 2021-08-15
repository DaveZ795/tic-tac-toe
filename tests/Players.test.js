import Players from '../assets/js/classes/Players.js';

describe('Players class', () => {
    afterEach(() => jest.restoreAllMocks());

    it('initializes', () => {
        // Setup
        Players.currentPlayer = 'O';
        const players = new Players();

        // Verify
        expect(players.currentPlayer).toEqual('X');
    });

    it('switches to player 1', () => {
        // Setup
        const players = new Players();
        players.currentPlayer = players.player2;
        players.changeCurrentPlayer();

        // Verify
        expect(players.currentPlayer).toEqual(players.player1);
    });

    it('switches to player 2', () => {
        // Setup
        const players = new Players();
        players.currentPlayer = players.player1;
        players.changeCurrentPlayer();

        // Verify
        expect(players.currentPlayer).toEqual(players.player2);
    });
});
