
// Select the canvas
const canvas = document.getElementById("myGame");
const context = canvas.getContext("2d");

// Draw rectangle function
function drawRect(x,y,w,h,color){
    context.fillStyle = color
    context.fillRect(x,y,w,h)
}

// Draw a Circle
function drawCircle(x,y,r,color){
    context.fillStyle = color
    context.beginPath()
    context.arc(x,y,r,0,Math.PI*2,false)
    context.closePath()
    context.fill()
}

// computer paddle
const user = {
    x: 10,
    y: canvas.height/2 - 50/2,
    width: 10,
    height: 50,
    color: "white",
    score:0
}

// User Paddle
const com = {
    x: canvas.width - 20,
    y: canvas.height/2 - 50/2,
    width: 10,
    height: 50,
    color: "white",
    score:0
}

function centerLine() {
    context.beginPath();
    context.setLineDash([10]);
    context.moveTo(canvas.width / 2, 0); // Start at the center horizontally
    context.lineTo(canvas.width / 2, canvas.height); // Draw vertically
    context.strokeStyle = "white";
    context.stroke();
}

// scores
function drawText(text,x,y,color){
    context.fillStyle = color
    context.font = "16px josefin sans"
    context.fillText(text,x,y)
}

// Create a ball
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 5,
    speed:1,
    velocityX : 1,
    velocityY : 1,
    color: "white"
}
  
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;

    ball.speed = 1;
    ball.velocityY = -ball.velocityY;
}


// render the Game
function render(){
    // Make canvas
    drawRect(0,0,400,600,"black");
    // computer paddle
    drawRect(com.x,com.y,com.width,com.height,com.color)
    // user paddle
    drawRect(user.x,user.y,user.width,user.height,user.color)
    // Center line
    centerLine();
    //create a ball
    drawCircle(ball.x,ball.y,ball.radius,ball.color)
    // scores of com and user
    drawText(user.score,(canvas.width / 2) - 20,20)
    drawText(com.score,(canvas.width / 2) + 15,20)
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

// Game over function
function ShowGameOver(){
    // Hide canvas
    canvas.style.display = "none";
    const can = document.getElementById("can");
    can.style.display = "none";
    // container
    const result = document.getElementById("result");
    result.style.display = "block";
}



function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // reflect from wall
    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
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
    }else if(ball.x + ball.radius > canvas.width){
        user.score++;
        resetBall()
    }

    //Game over
    if(user.score > 2 || com.score > 2){
        clearInterval(loop);
        ShowGameOver();
    }


}


//moving the paddles
let isWKeyPressed = false;
let isSKeyPressed = false;
let isUpKeyPressed = false;
let isDownKeyPressed = false;

document.addEventListener("keydown", function (event) {
    if (event.key === "w" || event.key === "W") {
        isWKeyPressed = true;
    } else if (event.key === "s" || event.key === "S") {
        isSKeyPressed = true;
    }
    if (event.key === "ArrowUp") {
        isUpKeyPressed = true;
    } else if (event.key === "ArrowDown") {
        isDownKeyPressed = true;
    }
});
document.addEventListener("keyup", function (event) {
    if (event.key === "w" || event.key === "W") {
        isWKeyPressed = false;
    } else if (event.key === "s" || event.key === "S") {
        isSKeyPressed = false;
    }
    if (event.key === "ArrowUp") {
        isUpKeyPressed = false;
    } else if (event.key === "ArrowDown") {
        isDownKeyPressed = false;
    }
});

function moveUserPaddle() {
    if (isWKeyPressed && user.y > 0) {
        user.y -= 1;
    }

    if (isSKeyPressed && user.y + user.height < canvas.height) {
        user.y += 1;
    }
    if (isUpKeyPressed && com.y > 0) {
        com.y -= 1;
    }

    if (isDownKeyPressed && com.y + com.height < canvas.height) {
        com.y += 1;
    }
}

function start(){
    update();
    moveUserPaddle();
    render();
}

const loop = setInterval(start, 1000/50);
