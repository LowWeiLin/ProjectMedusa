/*
 *
 *      Snake!
 *
 */

var DEBUG = false;
var socket = io.connect('http://127.0.0.1:3000');

socket.on("welcome", function (data) {
    console.log(data.text); // welcome test msg
});

//Main Game class.
function Game(){
    this.num_players = 0;
    this.game_speed = 0;
    this.board_x = 30;
    this.board_y = 20;
    this.board = null;
    this.running = false;
    
    this.player_array = null;//Array of players
    
}
//Initialize Game parameters
Game.prototype.init = function(p_num_players){
    this.numplayers = p_num_players;
    this.game_speed = 1000;
    this.running = false;
    this.board = null;
    
    //TODO: initialize players
    this.initplayers();
    
    if (DEBUG) console.log("Game Initialized.");
}

//Initialize Players
Game.prototype.initplayers = function(){
    this.player_array = new Array();
    for(var i=0 ; i<this.numplayers ; i++){
        this.player_array[i] = new Player(i,this.board_x,this.board_y);
        this.player_array[i].spawn(5,3);
    }
    
    if (DEBUG) console.log("Player(s) Initialized : "+this.numplayers);
}

//Initialize Board parameters
Game.prototype.init_board = function(x,y){
    this.board_x = x;
    this.board_y = y;
    this.board = new Array();
    
    for(var i=0 ; i<this.board_y ; i++){
        this.board[i] = new Array();
        for(var j=0 ; j<this.board_x ; j++){
            this.board[i][j] = 'O';
        }   
    }
    
    if (DEBUG) console.log("Board Initialized");
}

//Clear Board
Game.prototype.clear_board = function(x,y){

    for(var i=0 ; i<this.board_y ; i++){
        for(var j=0 ; j<this.board_x ; j++){
            this.board[i][j] = 'O';
        }   
    }
    
    if (DEBUG) console.log("Board Cleared");
}

//Print Board
Game.prototype.print_board = function(){ 
    if (DEBUG) console.log("Printing Board");
    
     var textboard="";
    
    for(var i=0 ; i<this.board_y ; i++){
        var line = "";
        for(var j=0 ; j<this.board_x ; j++){
            line+=this.board[i][j];
        }
        if (DEBUG) console.log(line);
        textboard+=line;
        textboard+="<br>";
    }
    
    //Write on window.


    $("#board").html(textboard);
}

//Update Board
Game.prototype.update_board = function(){ 
    if (DEBUG) console.log("Updating Board");
    
    for(var i=0 ; i<this.player_array.length ; i++){
        this.player_array[i].body.itr_reset();
        
        while(this.player_array[i].body.itr_hasnext()){
            //Draw the body of the snake on the board
            var temp = this.player_array[i].body.itr_next();
            this.board[temp[1]][temp[0]] = 'S';
        }
    }
}

Game.prototype.player_input = function(player, direction){
    this.player_array[0].setDir(direction);
}

//On Ready
$(document).ready(function(){
   // var board=$("<pre id=\"board\"></pre>").text("Text.");
   // $("body").append(board);
   $("#input").val("var a = 1;\n(function (){\n    return a++;\n})();");
});

//Code to execute.
var game0 = new Game();
game0.init(1);
game0.init_board(10,10);
game0.initplayers();
console.clear();


var key_dir=1;
$(document).keydown(function(e){
        switch(e.which){
            case 38://up
                key_dir=2;
                break;
            case 39://right
                key_dir=1;
                break;
            case 40://down
                key_dir=0;
                break;
            case 37://left
                key_dir=3;
                break;
        }
})




setkeydir();
repeat();
function setkeydir(){
    game0.player_array[0].setDir(key_dir);
    setTimeout(setkeydir, 200);
}

function repeat(){
    console.clear();
    game0.player_array[0].blindmove();
    game0.clear_board();
    game0.update_board();
    game0.print_board();
    setTimeout(repeat, 200);

    var result = parseInt(eval($("#input").val()));

    // new Function() evalutes code in local scope
    // needs a "return result" statement

    // var temp = new Function("result", $("#input").val());
    // var result = parseInt(temp())
    
    $("#result").html("Evaluated result: " + result + " (" + directionToString(result) + ")");

    socket.emit('result', result, function (np) {
        if (np) {
            // evaluated result received by server successfully
        } else {
            console.log("Error with evaluated result!");
        }
    });

}

socket.on("affirmative", function (data) {
    var result = parseInt(data.text);
    console.log("Server response: " + result + " (" + directionToString(result) + ")"); // verification message
});

function directionToString (direction) {
    switch(direction) {
        case 0:
            return "south";
        case 1:
            return "east";
        case 2:
            return "north";
        case 3:
            return "west";
    }
}