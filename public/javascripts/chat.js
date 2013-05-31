// $(function() {
//     var socket = io.connect('http://127.0.0.1:3000');

//     socket.on('welcome', function(data) {
//         console.log(data.text);
//     });

//     $("#set-nickname").submit(function (event) {
//         event.preventDefault();
//         socket.emit('nickname', {nickname: $("#nickname").val()}, function (data) {
//             if (data) {
//                 console.log("Nickname set successfully!");
//                 $("#set-nickname").hide();
//                 $("#send-message").show();
//             } else {
//                 $("#set-nickname").prepend('<p>Sorry, that nickname is already taken.');
//             }
//         });
//     });

//     $("#send-message").submit(function (event) {
//         event.preventDefault();
//         socket.emit("user message", $("#message").val());
//         $("#message").val("").focus();
//     })

//     socket.on('nicknameList', function(data) {
//         var html = "";
//         data.forEach(function (x) {
//             html += "<li>" + x + "</li>";
//         });
//         $("#nicknameList").empty().append(html);
//     });

//     socket.on('user message', function(data) {
//         $("#messages").append("<p><strong>" + data.nickname + "</strong>: " + data.message + "</p>");
//     });

// });