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
    
    if (DEBUG) console.log("Game Initialized.");
}

//Initialize Players
Game.prototype.initplayers = function(){
    this.state.player_array = new Array();
    for(var i=0 ; i<this.state.numplayers ; i++){
        this.state.player_array[i] = new Player(i,this.state.board_x,this.state.board_y);
        this.state.player_array[i].spawn(5,3);
    }
    
    if (DEBUG) console.log("Player(s) Initialized : "+this.state.numplayers);
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
    
    if (DEBUG) console.log("Board Initialized");
}

//Clear Board
Game.prototype.clear_board = function(x,y){

    for(var i=0 ; i<this.state.board_y ; i++){
        for(var j=0 ; j<this.state.board_x ; j++){
            this.board[i][j] = 'O';
        }   
    }
    
    if (DEBUG) console.log("Board Cleared");
}

//Print Board
Game.prototype.print_board = function(){
    //if (DEBUG) console.log("Printing Board");
    
    var textboard="";
    
    for(var i=0 ; i<this.state.board_y ; i++){
        var line = "";
        for(var j=0 ; j<this.state.board_x ; j++){
            line+=this.board[i][j];
        }
        //if (DEBUG) console.log(line);
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
    
    
    //drawBoard(translate(this.board));
}

//Update Board
Game.prototype.update_board = function(){ 
    //if (DEBUG) console.log("Updating Board");
    
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

//On Ready
$(document).ready(function(){
   // var board=$("<pre id=\"board\"></pre>").text("Text.");
   // $("body").append(board);
   $("#input").val("var a = 1;\n(function (){\n    return a++;\n})();");


    // only start game when canvas is fully loaded

    //Code to execute.
    var game0 = new Game();
    game0.init(1);
    game0.init_board(10,10);
    game0.initplayers();
    console.clear();

    setkeydir();
    repeat();
    function setkeydir(){
        game0.state.player_array[0].setDir(key_dir);
        setTimeout(setkeydir, 200);
    }

    function repeat(){
        console.clear();
        game0.state.player_array[0].blindmove();
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

});

// prevent scrolling of browser window; temp fix for layout issues
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

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


/*
 *      Client side handlers
 *
 */
//Welcome msg
socket.on("welcome", function (data) {
    console.log("Welcome message: " + data.text);
    console.log("Attempting to set username");
    socket.emit('setname',"guest");//set username, send to server.
});

function setname(name){
    socket.emit('setname',name);
}

//Setname
socket.on("setname", function (data) {
    console.log("Set username result: " + data);
    if( data != null ){
        //success, set username on client side
    } else {
        //failed. implement error code? already exists, invalid characters, etc.
    }
});

//Chat
function sendmsgtoall(msg){
    console.log('sending some rubbish message');
    socket.emit('chat',{target:'all',message:msg});
}
socket.on("chat", function (data) {
    alert("Message: ["+data.source+"]"+ data.message);
});

//Changestate
socket.on("changestate", function (data) {
    //change state to data.state
});


//
socket.on("affirmative", function (data) {
    var result = parseInt(data.text);
    console.log("Server response: " + result + " (" + directionToString(result) + ")"); // verification message
});

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