/*
 *
 *  Game State, the data to be sent from server to client.
 *
 *
 */


GameState = function(){
    
        this.num_players = 0;       //int
        this.game_speed = 0;        //int in ms
        this.board_x = 30;          //int
        this.board_y = 20;          //int
        this.running = false;       //boolean
        this.player_array = null;   //Array of player class
    
}
if( typeof client == 'undefined'){
    exports.GameState = GameState;
}