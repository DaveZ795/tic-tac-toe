/**
 * Handle the player definitions
 */
class Players {
    player1 = 'X';
    player2 = 'O';

    /**
     * Reset the current player every time the class is initialized
     */
    constructor() {
        this.currentPlayer = this.player1;
    }

    /**
     * Switch between player 1 and player 2
     */
    changeCurrentPlayer() {
        if (this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        }
    }
}

export default Players;
