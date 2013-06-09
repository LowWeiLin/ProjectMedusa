
var server_DEBUG = true;

/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
//    , user = require('./routes/user')
    , http = require('http')
    , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


//Give user index page
app.get('/', routes.index);

//Set up server to listen for connections
var server = http.createServer(app).listen(app.get('port'), "127.0.0.1", function(){
    console.log("Express server running at 127.0.0.1:" + app.get('port'));
});
var io = require("socket.io").listen(server);


//Set up users data
var conn = require("./connections.js");
var connections = conn.connections;
if(server_DEBUG) console.log("Connections table ready.");

//Set up rooms data
var rooms = require("./public/javascripts/rooms.js");
rooms = rooms.rooms;
rooms.initialize(connections);
if(server_DEBUG) console.log("Rooms table ready.");


/*
 *      Start of handlers
 */
io.sockets.on("connection", function (socket) {
    socket.emit("welcome", {text: "Welcome! You are connected!"});
    
        
    //Register user in connections
    if(server_DEBUG) console.log("Registering new connection.");
    
    connections.users[socket.id] = new connections.user(socket);
    
    //1. Setname
    socket.on("setname", function(_name){
        if(server_DEBUG) console.log("Request to setname to " + _name + " recv.");
        if(connections.users[socket.id].setname(_name) == true ){

            socket.emit("setname",{name:_name});
            socket.emit("changestate",{state:1});
        } else {
            socket.emit("setname",{name:null,
                                errormsg:'failed'});
        }
    });
    
    //2. Chat
    socket.on('chat', function(data){
        //Global message
        if( data.target == 'all'){
            io.sockets.emit('chat',{source:(connections.users[socket.id].username) ? connections.users[socket.id].username : 'Server'
                            , message:data.message});
        }
    });
    
    //3. Room commands
    socket.on('room', function(data){
        switch (data.request){
            case 'create':
                //Create a room
                var _id = rooms.addroom();
                if(_id == -1)
                    socket.emit('room',{reply:'create',result:'failed'});
                else
                    socket.emit('room',{reply:'create',result:'succeed',id:_id});
                break;
            case 'list':
                //Show list of avail rooms, perhps based on query/filter
                break;
            case 'join':
                var number = data.id;
                if(connections.users[socket.id].room == -1){//not already in a room
                    //Join the room
                    if(rooms.roomlist[number].join(socket.id)){//Able to join room
                        //emit result.
                        socket.emit('room',{reply:'join',result:'succeed',id:number});
                        //change state of client
                    }
                } else {
                    socket.emit('room',{reply:'join',result:'failed'});
                    if(server_DEBUG){console.log("User "+connections.users[socket.id].username+" failed to join room "+number+"!");}
                }
                break;
            //...
            case 'startgame':
                if(connections.users[socket.id].room != -1){//User has a room
                    //Request game to start
                    if(rooms.roomlist[connections.users[socket.id].room].startgame()){
                        //Succeed
                        if(server_DEBUG){console.log("Game start success!");}
                        socket.emit('room',{reply:'startgame',result:'succeed'});
                    }
                    
                    
                } else {
                    socket.emit('room',{reply:'startgame',result:'failed'});
                    if(server_DEBUG){console.log("User "+connections.users[socket.id].username+" does not belog to any room to start game!");}
                }
                
                break;
            case 'leave':
                break;
            default:
                break;
        }
    });
    
    
    //
    socket.on("result", function (data, callback) {
        // result validation
        if (typeof data !== "number") {
            // first result is always null for some reason
            callback(false);
        } else {
            callback(true);
            io.sockets.emit("affirmative", {text: data});
        }
    });
    //
    socket.on("user message", function (data) {
        io.sockets.emit("user message", {
            nickname: socket.nickname,
            message: data
        });
    });
    

    socket.on("disconnect", function () {
        if (!socket.nickname) return;
        if (users.indexOf(socket.nickname) > -1) {
            users.splice(users.indexOf(socket.nickname), 1);
        }
        printConnectedUsers();
    });
});

function printConnectedUsers() {
    console.log("Currently connected users:");
    users.forEach(function (user) {
        console.log("    " + user);
    });
}