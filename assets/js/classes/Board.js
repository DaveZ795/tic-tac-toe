/**
 * Keep track of the board state
 */
class Board {
    squares = [...Array(9)].map(() => '');
    domSquares = document.querySelectorAll('.board__square');

    /**
     * Setup a tic tac toe board
     *
     * @param {Game} game - all methods and parameters of the Game class
     */
    constructor(game) {
        this.game = game;

        // Attach listeners to every square in the constructor to avoid reregistering listeners when the board is reset
        this.domSquares.forEach(square => {
            square.addEventListener('mouseover', () => this.handleSquareMouseOver(square), false);
            square.addEventListener('mouseout', () => this.handleSquareMouseOut(square), false);
            square.addEventListener('click', () => this.handleSquareClick(square), false);
        });
    }

    /**
     * Show a preview of the move when hovering over a square
     *
     * @param {HTMLElement} square - the hovered square
     */
    handleSquareMouseOver(square) {
        // Only show the preview if the game isn't over and the square hasn't already been set
        if (this.canInteractWithSquare(square)) {
            square.classList.add('board__square--preview');
            square.textContent = this.game.players.currentPlayer;
        }
    }

    /**
     * Remove preview of the move when mouse leaves a square
     *
     * @param {HTMLElement} square - the un-hovered square
     */
    handleSquareMouseOut(square) {
        // Only remove the preview if the game isn't over and the square hasn't already been set
        if (this.canInteractWithSquare(square)) {
            square.classList.remove('board__square--preview');
            square.textContent = '';

        }
    }

    /**
     * The player clicked a square to select it
     *
     * @param {HTMLElement} square - the selected square
     */
    handleSquareClick(square) {
        // Only allow the player to select a square if the game isn't over and it hasn't already been set
        if (this.canInteractWithSquare(square)) {
            square.classList.remove('board__square--preview');
            this.setSquare(square, this.game.players.currentPlayer);
            this.game.checkForWinners();
            if (!this.game.winner) {
                this.game.players.changeCurrentPlayer();
            }
        }
    }

    /**
     * Mark a square as having been selected by a player
     *
     * @param {HTMLElement} square - the square to be updated
     * @param {String} player - the player who selected this square
     */
    setSquare(square, player) {
        const squareNumber = this.getSquareNumber(square);
        this.squares[squareNumber] = player;
        square.textContent =  player;
    }

    /**
     * Can a player interact with a specific square
     *
     * @param {HTMLElement} square - the square we are looking into
     * @return {boolean}
     */
    canInteractWithSquare(square) {
        const squareNumber = this.getSquareNumber(square);
        return !this.game.winner && !this.squares[squareNumber];
    }

    /**
     * Are all squares on the board already taken
     *
     * @return {boolean}
     */
    isFull() {
        return !this.squares.includes('');
    }

    /**
     * Find the location of a DOM square
     *
     * @param {HTMLElement} square - the square we are looking into
     * @return {string}
     */
    getSquareNumber(square) {
        return square.dataset.squareNumber;
    }

    /**
     * Get the values of all squares
     *
     * @return {string[]}
     */
    getCurrentState() {
        return this.squares;
    }

    /**
     * Clear off the board
     */
    reset() {
        this.domSquares.forEach(square => {
            this.setSquare(square, '');
        });
    }
}

export default Board;
