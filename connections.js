/*
 *      Connection class
 *
 *      To keep track of a user/connection, and its associated data, state.
 *
 */


function connections(){

    this.users = new Array();
    
    this.getNumConnections = function(){
        return this.users.length;
    }
 
    user = function(sock){
        this.username = 'undefined';//Username to identify user
        this.state = 0;             //0: homepage 1: room selection 2: Room settings 3: In Game 4: Scoreboard
        this.room = -1;              //Room currently in
        this.player = null;         //Player object
        this.socket = sock;
    }
    
    user.prototype.setname = function(_name){
        //Verify if name is available and valid(prevent code injection)
        this.username = _name;
        return true;//true for succeed.
    }
    
    user.prototype.changestate = function(_state){
        //Got to verify.
        this.state = _state;
    }
    
    user.prototype.getstate = function(){
        return this.state;
    }
    
    user.prototype.setroom = function(_room){
        this.room = _room;
    }
    
    user.prototype.getroom = function(){
        return this.room;
    }

    return this;
}

exports.connections = connections();