import Board from './Board.js';
import Players from './Players.js';

/**
 * Handle all game interactions
 */
class Game {
    newGameButton = document.querySelector('.new-game-button');
    winConditions = [
        // Horizontal wins
        [0,1,2],
        [3,4,5],
        [6,7,8],
        // Vertical wins
        [0,3,6],
        [1,4,7],
        [2,5,8],
        // Diagonal wins
        [0,4,8],
        [2,4,6]
    ];

    /**
     * Setup everything needed to play a game of tic tac toe
     */
    constructor() {
        this.board = new Board(this);
        this.newGameButton.addEventListener('click', () => this.startNewGame());
        this.startNewGame();
    }

    /**
     * Start a new game by resetting the players, the win state, and the board
     */
    startNewGame() {
        this.players = new Players();
        this.winner = false;
        this.board.reset();
    }

    /**
     * Let the players know who won
     */
    alertWinner() {
        this.winner = true;

        // Prevent alert from blocking the UI thread
        setTimeout(() => {
            window.alert(this.players.currentPlayer + ' Wins!');
        }, 1);
    }

    /**
     * Let the players know the game was a tie
     */
    alertTie() {
        // Prevent alert from blocking the UI thread
        setTimeout(() => {
            window.alert(this.players.player1 + ' and ' + this.players.player2 + ' Tie');
        }, 1);
    }

    /**
     * Look over the board to see if the game is over
     */
    checkForWinners() {
        const squares = this.board.getCurrentState();

        this.winConditions.forEach(winCondition => {
            // Players need 3 squares in a row to win
            // Each winCondition array contains 3 square numbers that would be a win
            // So check to see if player has selected all 3 of these square numbers and won
            let square0 = squares[winCondition[0]];
            let square1 = squares[winCondition[1]];
            let square2 = squares[winCondition[2]];

            if (square0 === '' || square1 === '' || square2 === '') {
                return;
            } else if (square0 === square1 && square0 === square2) {
                this.alertWinner();
            }
        });

        // If there's no winners and all squares have been selected, it's a tie
        if (!this.winner && this.board.isFull()) {
            this.alertTie();
        }
    }
}

export default Game;
