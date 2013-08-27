/*
 *
 *      Snake!
 *
 */

//For Inheritance
Object.defineProperty(Object.prototype, "Inherits", {value: function( parent )
{
	parent.apply(this, Array.prototype.slice.call(arguments, 1));
}});

Object.defineProperty(Function.prototype, "Inherits", {value: function( parent )
{
	this.prototype = new parent();
	Object.defineProperty(this.prototype, "constructor", {value: this});
}});


var DEBUG = false;

//Object Class

/*
 *  To provide a base class for objects on the board.
 *  Food, Obstacles, Special effects, etc.
 *
 *
*/

Obj = function(x, y){
    this.position = [x,y];
    this.name = 'undefined';
}

Obj.prototype.onTick = function(_gamestate){
    //Actions every tick
}

Obj.prototype.onCollision = function(_gamestate,_playerIndex){
    //Actions on collision with player head.
}

Obj.prototype.onDraw = function(){
    //What to draw?
    //Might not need this function...
}

///////////////////////
//Inherited Objects
///////////////////////


//Food
//What is snake without food?

Food.Inherits(Obj);

function Food(x,y){
    this.position = [x,y];
    this.name = 'Food';
    this.Inherits(Obj);
}

Food.prototype.onCollision = function(_gamestate,_playerIndex){
    //Actions on collision with player head.
    //1. Add score to player
    //2. Increase player length
    //3. Change location
}

//Stone
//Some nasty rocks to stop the snakes!

Stone.Inherits(Obj);

function Stone(x,y){
    this.position = [x,y];
    this.name = 'Stone';
    this.Inherits(Obj);
}

Stone.prototype.onCollision = function(_gamestate,_playerIndex){
    //Actions on collision with player head.
    //1. Kill Player XD
    _gamestate.player_array[_playerIndex].kill();
    
}



if( typeof client == 'undefined'){
    exports.Obj = Obj;
    exports.Food = Food;
    exports.Stone = Stone;
}
