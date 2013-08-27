/*
 *
 *      Main Game class.
 *
 *
 */

var game_DEBUG = true;

//Import GameState class
if( typeof client == 'undefined'){
    var GameState = require("./gamestate.js");
    var Player = require("./player.js");
    var Obj = require("./object.js");
    
    GameState = GameState.GameState;
    Player = Player.Player;
    
    //Objects...
    Food = Obj.Food;
    Stone = Obj.Stone;
    Obj = Obj.Object;//Last of Obj
    
    //console.log(GameState);
}

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
    
    this.room = null;
    
    this.state = new GameState();   //Game State, the data to be transmitted to client
    
    this.state.num_players = 0;
    this.state.game_speed = 0;
    this.state.board_x = 10;
    this.state.board_y = 10;
    this.state.running = 0;//0-Ready/paused, 1-Started, 2-Ended
    this.state.player_array = null;//Array of players
    this.state.object_array = null;//Array of objects(Food,Stone,...)
    
    this.board = null;//ascii board
    
    
    //Game Mode
    this.gameMode = 0;
    
    //Game Config
    this.config = {};
    this.config.dissapearOnDeath = true;
    this.config.spawnFood = true;
    this.config.collisions = true;
    
    
    
    //Keep track of number of objects in each cell per tick
    this.numberGrid = new Array();
    
    //To keep track of who has sent input
    this.temp_count = 0;
    this.temp = new Array();
}
//Initialize Game parameters
Game.prototype.init = function(p_num_players){
    this.state.num_players = p_num_players;
    this.state.game_speed = 500;
    this.state.running = 0;
    this.board = null;
    
    //initialize players
    this.initplayers();
    
    //initialize objects
    this.state.object_array = new Array();
    var _tObj = new Stone(0,0);
    this.state.object_array.push(_tObj);
    
    
    //initialize numberGrid
    for(var i=0 ; i<this.state.board_y ; i++){
        this.numberGrid[i] = new Array();
        for(var j=0 ; j<this.state.board_x ; j++){
            this.numberGrid[i][j] = {};
            this.numberGrid[i][j].n = 0;
        }
    }
    
    if (game_DEBUG) console.log("Game Initialized.");
}

//Initialize Players
Game.prototype.initplayers = function(){
    this.state.player_array = new Array();
    for(var i=0 ; i<this.state.num_players ; i++){
        this.state.player_array[i] = new Player(i,this.state.board_x,this.state.board_y);
        this.state.player_array[i].spawn(5,i);
    }
    
    if (game_DEBUG) console.log("Player(s) Initialized : "+this.state.num_players);
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

//For client side
Game.prototype.alloc_board = function(){
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
Game.prototype.clear_board = function(){

    for(var i=0 ; i<this.state.board_y ; i++){
        for(var j=0 ; j<this.state.board_x ; j++){
            this.board[i][j] = -1;
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
    /* No need
    function translate (matrix) {
        return matrix.map(function (row) {
            return row.map(function (cell) {
                return cell === 'S';
            });
        });
    }*/

    
    draw(this.state);
    //drawBoard(this.board,this.state.num_players);
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
       if (game_DEBUG) console.log(i);
        for(var j=0 ; j< this.state.player_array[i].body.length ; j++){
            if (game_DEBUG) console.log(j);
            //Draw the body of the snake on the board
            var temp = this.state.player_array[i].body[j];
            this.board[temp[1]][temp[0]] = i;
            
        }
    }
}

Game.prototype.clearNumberGrid = function(){
    for(var i=0 ; i<this.state.board_y ; i++){
        this.numberGrid[i] = new Array();
        for(var j=0 ; j<this.state.board_x ; j++){
            this.numberGrid[i][j] = {};
            this.numberGrid[i][j].n = 0;
        }
    }
}

Game.prototype.update_state = function(){
    //Check if all players are dead...
    var _alive = 0;
    for(var i=0 ; i<this.state.player_array.length ; i++){
        if(this.state.player_array[i].isAlive()){
            _alive++;
            break;
        }
    }
    if(_alive == 0){//Alllll players are dead! What shall we do?
        this.stop();
    }

    //Update players,objects
    for(var i=0 ; i<this.state.player_array.length ; i++){
        //Update Players
        if(this.state.player_array[i].isAlive()){
            this.state.player_array[i].blindmove();
        }
        //Update Objects
        
    }    
    
    if(this.config.collisions == true){//If collisions enabled
        //Clear numberGrid
        this.clearNumberGrid();
        //Add count to numberGrid
        for(var i=0 ; i<this.state.player_array.length ; i++){
            //Add Players
            for(var j=0 ; j<this.state.player_array[i].body.length ; j++){
                var _t = this.state.player_array[i].body[j];
                this.numberGrid[_t[0]][_t[1]].n++;
            }
            //Add Objects
            //Maybe not.
            
            
        }
        
        for(var i=0 ; i<this.state.player_array.length ; i++){
        //Check for collision
            //Check player head.
            var _t = this.state.player_array[i].body[0];
            //Check collision with snakes
            if(this.numberGrid[_t[0]][_t[1]].n>=2){
                console.log('Collision!\nPlayer: '+i+'\nAt:'+_t+' ');
                if( this.state.player_array[i].isAlive()){
                    this.state.player_array[i].kill();
                    this.room.emit('chat',{source:'Room '+this.room.roomid
                                , message:this.room.connections.users[this.room.users[i]].username+' Died!'});
                }
                
            }
            
            //Check collision with objects
            
            
        }
    
        
    }
    
    //Check if all players are dead...
    _alive = 0;
    for(var i=0 ; i<this.state.player_array.length ; i++){
        if(this.state.player_array[i].isAlive()){
            _alive++;
            break;
        }
    }
    if(_alive == 0){//Alllll players are dead! What shall we do?
        this.stop();
    }
    
    //Clear temp
    this.temp_count = 0;
    this.temp = new Array();
}

Game.prototype.run = function(){
    this.state.running = 1;
}

Game.prototype.isRunning = function(){
    return (this.state.running == 1);
}

Game.prototype.hasEnded = function(){
    return (this.state.running == 2);
}

Game.prototype.pause = function(){
    this.state.running = 0;
}

Game.prototype.stop = function(){
    this.state.running = 2;
}

Game.prototype.player_input = function(player, direction){
    //Validate game is running
    if( !this.isRunning() ){
        //Game not running. Ignore it and return state.
        return this.state;
    }
    //Validate direction
    if(direction<0 || direction>3){
        //Invalid direction given. Ignore it and return state.
        return this.state;
    }
    //Keep count of number of inputs received.
    if(this.temp[player] != 1){
        this.temp_count++;
        this.temp[player] = 1;
    }
    //Set Direction for Player.
    this.state.player_array[player].setDir(direction);
    
    if (game_DEBUG) console.log('PLAYER INPUT: P:'+player+" D:"+direction);
    
    var _up = false;//is the state updated? / all user input received?
    if(this.temp_count == this.state.num_players){
        _up = true;
        if (game_DEBUG) console.log('ALL PLAYER INPUT RECEIVED');
        //Update state and send update to players
        //-> Don't update. wait and update every tick instead.
        //this.update_state();
        
        
    }
    //return state for sending to player.
    return {_updated:_up, _state:this.state};
}


if( typeof client == 'undefined'){
    exports.Game = Game;
}
