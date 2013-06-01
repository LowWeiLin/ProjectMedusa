/*
 *
 *      Snake!
 *
 */

//Direction coordinates.
var DIR = [[0,1],//up
           [1,0],//right
           [0,-1],//down
           [-1,0]]//left

var DEBUG = false;

//Player Class
function Player(n, x, y){
    this.number = n;
    this.body = null;
    this.alive = false;
    this.length = 5;
    this.board_x = x;
    this.board_y = y;
    
    this.movedir = 1;//0,1,2,3 - up right down left
}

Player.prototype.spawn = function(x,y){
    //Head at x,y, body length 5, tail x-5,y
    this.alive = true;
    this.movedir = 1;
    this.body = new LinkedList();
    for(var i=0 ; i<this.length ; i++){
        this.body.AddToTail([x-i,y]);
    }
    if (DEBUG) console.log("Player "+this.number+" spawned.");
}

Player.prototype.setDir = function(dir){
    if(this.movedir == dir){
        //Already in the direction.
    } else if(this.movedir%2 == dir%2){
        //No change in dir.
    } else {
        this.movedir = dir; 
    }
}

Player.prototype.nextmove = function(){
    //checking for collision? death?
        //Do in game engine.
    //return location of next move.
    return [((this.board_x+(this.body.head.data[0]+DIR[this.movedir][0]))%this.board_x), ((this.board_y+(this.body.head.data[1]+DIR[this.movedir][1]))%this.board_y)];
}

Player.prototype.removetail = function(){
    this.body.removeAt(this.body.size-1);
}
Player.prototype.addhead = function(){
    this.body.AddToHead(this.nextmove());
}

Player.prototype.blindmove = function(){
    this.removetail();
    this.addhead();
}
