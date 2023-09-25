const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

//game setup
canvasWidth = 0;
canvasHeight = 0;

// user paddle
const user = {
  x: 10,
  y: canvasHeight/2 - 50/2,
  width: 10,
  height: 50,
  color: "white",
  score:0
}

// User2 Paddle
const com = {
  x: canvasWidth - 20,
  y: canvasHeight/2 - 50/2,
  width: 10,
  height: 50,
  color: "white",
  score:0
}

// Create a ball
const ball = {
  x: canvasWidth/2,
  y: canvasHeight/2,
  radius: 5,
  speed:1,
  velocityX : 1,
  velocityY : 1,
  color: "white"
}

function resetBall(){
  ball.x = canvasWidth/2;
  ball.y = canvasHeight/2;

  ball.speed = 1;
  ball.velocityY = -ball.velocityY;
}

// Updated collision detection function
function collision(ball, playerOrComputer) {
  // Calculate the center of the ball
  const ballX = ball.x;
  const ballY = ball.y;

  // Calculate the boundaries of the player or computer paddle
  const playerOrComputerX = playerOrComputer.x;
  const playerOrComputerY = playerOrComputer.y;
  const playerOrComputerWidth = playerOrComputer.width;
  const playerOrComputerHeight = playerOrComputer.height;

  // Check for collisions
  if (
      ballX + ball.radius > playerOrComputerX && // Ball's right edge is to the right of the paddle's left edge
      ballX - ball.radius < playerOrComputerX + playerOrComputerWidth && // Ball's left edge is to the left of the paddle's right edge
      ballY + ball.radius > playerOrComputerY && // Ball's bottom edge is below the paddle's top edge
      ballY - ball.radius < playerOrComputerY + playerOrComputerHeight // Ball's top edge is above the paddle's bottom edge
  ) {
      return true; // Collision detected
  }

  return false; // No collision
}

function update(){
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // reflect from wall
  if(ball.y + ball.radius > canvasHeight || ball.y - ball.radius < 0){
      ball.velocityY = -ball.velocityY;
  }

  //collision checker
  if (collision(ball, user)) {
      // Handle collision with the user's paddle
      ball.velocityX = -ball.velocityX;
  } else if (collision(ball, com)) {
      // Handle collision with the computer's paddle
      ball.velocityX = -ball.velocityX;
  }


  // points
  if(ball.x - ball.radius < 0){
      com.score++
      resetBall()
  }else if(ball.x + ball.radius > canvasWidth){
      user.score++;
      resetBall()
  }

  //Game over
  if(user.score > 2 || com.score > 2){
      ShowGameOver();
  }


}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  //setting up canvas dimension
  socket.on("canvasDim", (data) => {
    canvasWidth = data.canvasWidth;
    canvasHeight = data.canvasHeight;
    ball.x= canvasWidth/2;
    ball.y = canvasHeight/2;
    com.x = canvasWidth - 20;
    com.y = canvasHeight/2 - 50/2;
    user.x = 10;
    user.y = canvasHeight/2 - 50/2;

    socket.emit("init", {
      ball_name: ball,
      user_name: user,
      com_name: com
    })


    // Define a function to send the render data
    function sendRenderData() {
      update();
      socket.emit("render", {
        ball_name: ball,
        user_name: user,
        com_name: com
      });
    }

    socket.on("S", ()=>{
      user.y += 1;
    });
    socket.on("W", ()=>{
      user.y -= 1;
      console.log("W received!");
    });
    socket.on("U", ()=>{
      com.y -= 1;
    });
    socket.on("D", ()=>{
      com.y += 1;
    });


    function ShowGameOver(){
      clearInterval(sendRenderData);
      socket.emit("game_over");
    }

    // Emit the "render" event 60 times every second
    const intervalId = setInterval(sendRenderData, 1000 / 60); 
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});