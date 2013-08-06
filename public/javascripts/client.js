/*
 *
 *      Client side JS code
 *
 */

var DEBUG = true;


//Connect to server
//var socket = io.connect('http://127.0.0.1:3000');
var socket = io.connect('http://lwl1991.no-ip.org:3000');

//Client side data(should be same as connections.user data)
var username = null;
var state = 0;
var room = -1;
var player = null;



//Client is to:
//  get input from user/eval script, send to server
//  recv gamestate from server, render.


//Detailed Sequence:
//Client                //Server
//1. Connect            1. Welcome Msg
//2. Setname            2. Setname result
//
//3. Create Room        3. Create Room Result
//4. Join Room          4. Join Room Result
//
//5. Start Game         5. Start Game Result
//                      6. Start Game Signal(to all players)
//Loop:
//7. Send user input    7. Wait for all player input
//                      8. Update game state
//                      9. Send gamestate to all players
//End Loop(End game)
//10. Request scores    10. Send Scores
//
//



/*
 *      Client side handlers
 *
 */

//Welcome msg
//Prepare to recv red carpet welcome
socket.on("welcome", function (data) {
    console.log("Welcome message: " + data.text);
    console.log("Attempting to set username");
    socket.emit('setname',"guest");//set username, send to server.
});

//0. Changestate
socket.on("changestate", function (data) {
    //change player state to data.state as given by server.// ignore for now.
});

//1. Setname
    //function to test and setname
    function setname(name){
        socket.emit('setname',name);
    }
socket.on("setname", function (data) {
    console.log("Set username result: " + data.name);
    if( data.name != null ){
        //success, set username on client side
        username = data.name;
    } else {
        //failed. implement error code? already exists, invalid characters, etc.
        if(DEBUG){console.log("Error setting name. Error: " + data.errormsg);}
    }
});


//2. Chat
    function sendmsg(){
        sendmsgtoall($("#chatinput").val());
        $("#chatinput").val('');
    }
    $(document).ready(function() {
        $("#chatinput").keyup(function(e) {
            if(e.keyCode == 13) {
                sendmsg();
            }
        });
        
        $("#nameinput").change(function() {
            setname($('#nameinput').val());
        });
        
        $("#start").mouseup(function(){
                startgame();    
            }
        )
        
        
        $(document).keydown(function(e){
            switch(e.which){
                case 'W'.charCodeAt(0)://w
                    console.log('sendinginput');
                    sendinput(2);
                    break;
                case 'A'.charCodeAt(0)://a
                    console.log('sendinginput');
                    sendinput(3);
                    break;
                case 'S'.charCodeAt(0)://s
                    console.log('sendinginput');
                    sendinput(0);
                    break;
                case 'D'.charCodeAt(0)://d
                    console.log('sendinginput');
                    sendinput(1);
                    break;
                default:
                    break;
            }
        });

        
    });

    function sendmsgtoall(msg){
        //console.log('sending some rubbish message');
        socket.emit('chat',{target:'all',message:msg});
        //$('#chat').val($('#chat').val()+'[Me]'+msg+'\n');
    }
socket.on("chat", function (data) {
    //alert("Message: ["+data.source+"]"+ data.message);
    $('#chat').val($('#chat').val()+'['+data.source+']'+data.message+'\n');
    //Keep textarea scrolled to bottom.
    $('#chat').scrollTop($('#chat')[0].scrollHeight);
});

//3. Rooms
    function createroom(){
        console.log("Attempting to create a room...");
        socket.emit('room',{request:'create'});
    }
    function joinroom(_id){
        console.log("Attempting to join a room...");
        socket.emit('room',{request:'join',id:_id});
    }
    function startgame(){
        console.log("Attempting to start game...");
        socket.emit('room',{request:'startgame'});
        
    }
    
socket.on('room', function (data) {
    switch (data.reply){
        case 'create':
            //Result from attempt to create room
            if(data.result == 'succeed'){
                //Succeed, now join the room, data.id
                socket.emit('room',{request:'join',id:data.id});
                if(DEBUG){console.log("Created room "+data.id+"!");}
            } else {
                if(DEBUG){console.log("Error in creating room!");}
            }
            break;
        case 'join':
            //Result from attempt to join room
            if(data.result == 'succeed'){
                //Succeed
                room = data.id;
                $('#room').val(room);
                if(DEBUG){console.log("Joined room: "+room+"!");}
            } else {
                if(DEBUG){console.log("Error in joining room!");}
            }
            break;
        case 'startgame':
            //Signal to prepare and start game
            if(data.result == 'succeed'){
                //Succeed
                if(DEBUG){console.log("Started game!");}
                console.log('Preparing local instance...');
                locGame = new Game();
                
                socket.emit('room',{request:'ready'});
                
            } else {
                if(DEBUG){console.log("Error in starting game!");}
            }
            break;
        default:
            break;
    }
});

//Game
socket.on('room', function (data) {
    switch (data.msg){
        case 'start':
            //feed updated gamestate into display module.
            if(DEBUG){console.log("Initial game state!");}
            
            locGame.state = data.state;
            locGame.alloc_board();
            locGame.clear_board();
            locGame.update_board();
            locGame.print_board();
            
            break;
        case 'update':
            //feed updated gamestate into display module.
            if(DEBUG){console.log("Updating game state!");}
            
            locGame.state = data.state;
            locGame.clear_board();
            locGame.update_board();
            locGame.print_board();
            
            break;
        case 'end':
            //end game gracefully, show game stats
            if(DEBUG){console.log("Game end signal!");}
            break;
        default:
            break;
    }
});
    //Send game input:
    function sendinput(dir){
        socket.emit('game',{msg:'input',value:dir});
    }


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

