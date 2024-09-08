
var express = require('express');
var app = express();
var server = require('http').Server(app)

const io = require("socket.io")({
    allowEIO3: true // false by default
  }).listen(server)

var participantsList = [];
var typingUsers = {};

app.get('/' , (req , res)=>{

   res.send('<h1>ChatMe SocketIO server is up and running</h1>')

});

app.get('/login' , (req , res)=>{
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(data));
 
 });

 app.get('/singUp' , (req , res)=>{
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(data));
 });

app.post('/', (req, res)=>{

});

app.use(require('express').static(__dirname + '/public'));

io.on('connection', function(clientSocket) {
    
    console.log('a user connect');

    clientSocket.on("login", function(clientNickName, email) {
        var currentDateTime = new Date().toLocaleString();
        console.log('user logged in with username %s and email %s', clientNickName, email);
        io.emit("loginResponse",clientNickName, email, currentDateTime);
    });

    clientSocket.on("logout", function(clientNickName) {
        io.emit("logoutResponse", clientNickName);
    });

    clientSocket.on('disconnect', function() {
        console.log('user disconnect');

    var clientNickName;
    for (var i=0; i<participantsList.length; i++) {
        if (participantsList[i]["id"] === clientSocket.id) {
            participantsList["isConnected"] = false;
            clientNickName = participantsList[i]["nickname"];
            break;
        }
    }

    delete typingUsers[clientNickName];
    io.emit("participantsList", JSON.stringify(participantsList));
    io.emit("userExitUpdate", clientNickName);
    io.emit("userTypeUpdate", typingUsers);
});

    clientSocket.on("leave", function(clientNickName) {
        for(var i=0; i<participantsList.length; i++) {
            if (participantsList[i]["id"] === clientSocket.id) {
                participantsList.slice(i, 1);
                break;
            } 
        }
        io.emit("participantsList", JSON.stringify(participantsList));
        io.emit("userLeftResponse", clientNickName);
    });

    clientSocket.on("message", function(clientNickName, message) {
        var currentDateTime = new Date().toLocaleString();
        delete typingUsers[clientNickName];
        console.log('Create message by user'+ clientNickName + 'and with message:' + message);
        io.emit("userTypingUpdate", typingUsers);
        io.emit("newTextMessage", clientNickName, message, currentDateTime);
    });

    clientSocket.on('privateMessage', function(clientNickName, message){
        var currentDateTime = new Date().toLocaleString();
        delete typingUsers[clientNickName];
        console.log('Create message by user'+ clientNickName + 'and with message:' + message);
        io.emit("userTypingUpdate", typingUsers);
        io.emit("newPrivateTextMessage", clientNickName, message, currentDateTime);
    });

    clientSocket.on('join', function(clientNickName, chatroomId){
        var message = "User" + clientNickName + " join chatroom with id " + chatroomId;
        console.log(message);

        var userInfo = {};
        var founfUser = false;

        for (var i=0; i<participantsList.length; i++){
            if (participantsList[i]["nickname"] === clientSocket.id) {
                participantsList[i]["isConnected"] = true;
                participantsList[i]["id"] = clientSocket.id;
                userInfo = participantsList[i];
                founfUser = true;
                break
            }
        }

        if (!founfUser) {
            userInfo["id"] = clientSocket.id;
            console.log("Socket id= " + clientSocket.id);
            userInfo["neckname"] = clientNickName;
            userInfo["isConnected"] = true;
            participantsList.push(userInfo);
        }

        console.log(JSON.stringify(participantsList));

        io.emit('userJoinedResponse',userInfo);
        io.emit("participantsList", JSON.stringify(participantsList));
    });

    clientSocket.on('startType', function(clientNickName) {
        console.log("User " + clientNickName + " is wrinting a message...");
        typingUsers[clientNickName] = 1;
        io.emit('userTypingResponse', typingUsers);
    });

    clientSocket.on('stopType', function(clientNickName) {
        console.log("User " + clientNickName + " has stopped wrinting a message...");
        delete typingUsers[clientNickName];
        io.emit('userTypingResponse', typingUsers);
    });

});

server.listen(3001, function() {
    console.log('Listening on: 3001');
});