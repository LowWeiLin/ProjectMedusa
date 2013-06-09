/*
 *      Rooms class
 *
 *      To keep a list of rooms and its associated data
 *
 */


var room_DEBUG = true;

//Import Game class
var Game = require("./game.js");
Game = Game.Game;

function rooms(){

    this.roomlist = new Array(); 
    this.connections = null;
    this.maxrooms = 1;
    
    this.initialize = function(conn){
        this.connections = conn;
        this.maxrooms = 10;
    }
    
    this.addroom = function(){
        if(roomlist.length < maxrooms){
            var id = roomlist.length;
            this.roomlist[id] = new room();
            this.roomlist[id].roomid = id;
            this.roomlist[id].connections = this.connections;
            return id;
        } else {
            return -1;//Failed.
        }
    }
    
    this.removeroom = function(roomid){
        //inform all players room is closing
        this.roomlist[roomid] = null;
    }

    
    /*
     *
     *      Sub class room
     *
     */
    room = function(){
        this.roomid = null;         //unique int representing room number
        this.users = new Array();   //Array of user id's
        this.game = null;           //Game instance in room
        this.state = 0;             //State of the room - 0: setting up 1: in game 2: score board/game end
        this.connections = null;
    }
    
    room.prototype.join = function(userid){
        //check if able to join, not already joined
        //TODO: the validation
        if(this.state == 0){
            this.users.push(userid);
            this.connections.users[userid].room = this.roomid;
            console.log("HEREass"+this.users[0]);
            return true;//succeed
        } else {
            return false;//failed
        }
    }
    
    room.prototype.disconnect = function(userid){
        //remove player if exists
        for(var i=0 ; i<this.users.length ; i++){
            if( this.users[i] == userid ){
                this.users = this.users.splice(i,1);
                break;
            }
        }
    }
    
    room.prototype.startgame = function(){
        //Start game with current players
        this.state = 2;
        this.game = new Game();
        this.game.init(users.length);
        this.game.init_board(10,10);
        this.game.initplayers();
        //Now enter game loop and wait for all players input, then update and send updated state.

        //Send out start game signal/state to all players
        for(var i=0 ; i<this.users.length ; i++){
            //YAWNZ iTS 2.30 am. but finally can start game. DEBUGZ LIKEZ HELLZ
            this.connections.users[this.users[i]].socket.emit('game',{msg:'start',state:this.game.state});//STATE
        }
        
        //Add handlers for players input here
        for(var i=0 ; i<this.users.length ; i++){
            this.connections.users[this.users[i]].socket.emit('game',{msg:'start',state:this.game.state});//STATE
        }
        
        
        
        return true;//succeed in starting game.
    }
    
    room.prototype.endgame = function(){
        //End game cleanup.
        //Remove handlers for players input
        
        for(var i=0 ; i<this.users.length ; i++){
            connections.users[users[i]].socket.removeAllListeners('game');
        }
        
    }
    

    return this;
}




exports.rooms = rooms();