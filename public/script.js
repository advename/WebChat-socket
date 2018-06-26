//Connect to the NodeJS socket server
const socket = io.connect('http://127.0.0.1:3000');

// Query DOM
const message = document.querySelector("#message"),
  user = document.querySelector("#user"),
  btn = document.querySelector("#send"),
  output = document.querySelector("#output"),
  feedback = document.querySelector("#feedback");
// On Send click, fire the function to send the data to the NodeJS socket server
btn.addEventListener("click", function() {
  socket.emit("chat", { //send data as an object
    message: message.value,
    user: user.value
  });
  message.value = ""; //Empty message box after sended message
  userIsTyping = false; //Allow eventListener again for keypress
});

//Listen for chat updates, and if there is new data, append it inside the output
socket.on('chat', function(data) {
  console.log(data);
  let newMessage = document.createElement("p"); //Create a new p element
  let userName = document.createElement("strong"); //Create a <strong> element for the username
  userName.textContent = data.user + " : "; //Fill out the username
  newMessage.textContent = data.message; //Fill out the message
  newMessage.prepend(userName); //Add <strong>username</strong> in beginning of <p>
  output.appendChild(newMessage); //Add it to the output
  feedback.innerHTML = ""; //Empty user typing notification /broadcast
});

//Listen if the user is typing a message and broadcast a notification to everyone
let userIsTyping = false; //Send broadcast only once during typing
message.addEventListener("keypress" , function(){
  if(userIsTyping === false){
    socket.emit("typing", {
      user: user.value
    })
    userIsTyping = true;
  }
});

//Show users that another user is typing a message
socket.on("typing", function(data){
  let userTyping = document.createElement("p");
  userTyping.textContent = data.user + " is typing a message..."
  feedback.appendChild(userTyping);
})
