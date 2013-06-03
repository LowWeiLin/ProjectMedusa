/*
 *      Connection class
 *
 *      To keep track of a user/connection, and its associated data, state.
 *
 */


function connections(){

    this.users = new Array(); 
 
    user = function(){
        this.username = 'test';     //Username to identify user
        this.state = 3;             //0: homepage 1: room selection 2: Room settings 3: In Game
        this.room = 0;              //Room currently in
        this.player = null;         //Player object
        
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
    
    user.prototype.setroom = function(_room){
        this.room = _room;
    }

    return this;
}

exports.connections = connections();