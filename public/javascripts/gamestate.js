/*
 *
 *  Game State, the data to be sent from server to client.
 *
 *
 */


function GameState(){
    this.num_players = 0;       //int
    this.game_speed = 0;        //int in ms
    this.board_x = 30;          //int
    this.board_y = 20;          //int
    this.running = false;       //boolean
    this.player_array = null;   //Array of .players
}