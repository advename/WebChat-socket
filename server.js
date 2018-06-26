const express = require("express");
const socket = require("socket.io");

let app = express();


//Run the app on port 3000
let server = app.listen(3000, function(){
  console.log("Listening for requests on port 3000");
})

//Serve folder as normal website (static files)
app.use(express.static("public"));

// Create a socket connection using the server = app.listen(....)
let io = socket(server);

// On a connection, listen for an emmited event called chat or typing
// If this event happend, get the data and send it to all the other sockets connections
io.on("connection" , function(socket){

  //Handle chat events -> Send message with username
  socket.on("chat" , function(data){
    console.log("Socket connected: " + JSON.stringify(data));
     io.sockets.emit("chat" , data); //sockets in plural because we send it to ALL
  })

  //Handle typing events -> Display which user currently is typing
  socket.on("typing" , function(data){
    console.log("Current user typing: " + JSON.stringify(data.user));
    socket.broadcast.emit("typing", data); //sockets in plural because we send it to ALL
  })
})
