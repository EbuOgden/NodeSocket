const socket = io.connect("http://localhost:3000");

socket.on("connect", function(data){
  socket.emit("joined", "Hello World from client!");
})

socket.on("messages", function(data){
  console.log(data);
})

$("#form").submit(function(e){
  e.preventDefault();
  const message = $("#chat_input").val();

  const obj = {
    message : message
  }
  socket.emit("messages", obj);
})

socket.on("broad", function(data){
  console.log(data);
  $('#future').append("<li>" + data + "</li>");
})
