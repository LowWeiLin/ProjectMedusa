
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

app.get('/', routes.index);
// app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), "127.0.0.1", function(){
    console.log("Express server running at 127.0.0.1:" + app.get('port'));
});

var io = require("socket.io").listen(server);

io.sockets.on("connection", function (socket) {
    socket.emit("welcome", {text: "Welcome! You are connected!"});

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