/*
 *
 *      Snake!
 *
 */


var DEBUG = false;

//Object Class

/*
 *  To provide a base class for objects on the board.
 *  Food, Obstacles, Special effects, etc.
 *
 *
*/

Object = function(x, y){
    this.position = [x,y];
    this.name = 'undefined';
}

Object.prototype.onTick = function(_gamestate){
    //Actions every tick
}

Object.prototype.onCollision = function(_gamestate,_playerIndex){
    //Actions on collision with player head.
}

Object.prototype.onDraw = function(){
    //What to draw?
    //Might not need this function...
}

///////////////////////
//Inherited Objects






if( typeof client == 'undefined'){
    exports.Object = Object;
}
