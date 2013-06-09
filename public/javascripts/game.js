/*
 *
 *      Main Game class.
 *
 *
 */

var game_DEBUG = true;

//Import GameState class
var GameState = require("./gamestate.js");
GameState = GameState.GameState;
console.log(GameState);

function directionToString (direction) {
    switch(direction) {
        case 0:
            return "South";
        case 1:
            return "East";
        case 2:
            return "North";
        case 3:
            return "West";
        default:
            return "Error";
    }
}

Game = function(){
    
    this.state = new GameState();   //Game State, the data to be transmitted to client
    
    this.state.num_players = 0;
    this.state.game_speed = 0;
    this.state.board_x = 30;
    this.state.board_y = 20;
    this.state.running = false;
    this.state.player_array = null;//Array of players
    
    this.board = null;
    
    
}
//Initialize Game parameters
Game.prototype.init = function(p_num_players){
    this.state.numplayers = p_num_players;
    this.state.game_speed = 1000;
    this.state.running = false;
    this.board = null;
    
    //TODO: initialize players
    this.initplayers();
    
    if (game_DEBUG) console.log("Game Initialized.");
}

//Initialize Players
Game.prototype.initplayers = function(){
    this.state.player_array = new Array();
    for(var i=0 ; i<this.state.numplayers ; i++){
        this.state.player_array[i] = new Player(i,this.state.board_x,this.state.board_y);
        this.state.player_array[i].spawn(5,3);
    }
    
    if (game_DEBUG) console.log("Player(s) Initialized : "+this.state.numplayers);
}

//Initialize Board parameters
Game.prototype.init_board = function(x,y){
    this.state.board_x = x;
    this.state.board_y = y;
    this.board = new Array();
    
    for(var i=0 ; i<this.state.board_y ; i++){
        this.board[i] = new Array();
        for(var j=0 ; j<this.state.board_x ; j++){
            this.board[i][j] = 'O';
        }   
    }
    
    if (game_DEBUG) console.log("Board Initialized");
}

//Clear Board
Game.prototype.clear_board = function(x,y){

    for(var i=0 ; i<this.state.board_y ; i++){
        for(var j=0 ; j<this.state.board_x ; j++){
            this.board[i][j] = 'O';
        }   
    }
    
    if (game_DEBUG) console.log("Board Cleared");
}

//Print Board
Game.prototype.print_board = function(){
    if (game_DEBUG) console.log("Printing Board");
    
    var textboard="";
    
    for(var i=0 ; i<this.state.board_y ; i++){
        var line = "";
        for(var j=0 ; j<this.state.board_x ; j++){
            line+=this.board[i][j];
        }
        if (game_DEBUG) console.log(line);
        textboard+=line;
        textboard+="<br>";
    }
    
    //Write on window.
    // $("#board").html(textboard);

    // Draw board to canvas
    function translate (matrix) {
        return matrix.map(function (row) {
            return row.map(function (cell) {
                return cell === 'S';
            });
        });
    }

    drawBoard(translate(this.board));
}

//Update Board
Game.prototype.update_board = function(){ 
    if (game_DEBUG) console.log("Updating Board");
    
    /*
    for(var i=0 ; i<this.state.player_array.length ; i++){
        this.state.player_array[i].body.itr_reset();
        
        while(this.state.player_array[i].body.itr_hasnext()){
            //Draw the body of the snake on the board
            var temp = this.state.player_array[i].body.itr_next();
            this.board[temp[1]][temp[0]] = 'S';
        }
    }*/
    for(var i=0 ; i<this.state.player_array.length ; i++){
       
        for(var j=0 ; j< this.state.player_array[i].body.length ; j++){
            //Draw the body of the snake on the board
            var temp = this.state.player_array[i].body[j];
            this.board[temp[1]][temp[0]] = 'S';
        }
    }
}

Game.prototype.player_input = function(player, direction){
    this.state.player_array[0].setDir(direction);
}

exports.Game = Game;
