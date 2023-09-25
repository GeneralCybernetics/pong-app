
////////// RENDER & INIT CANVAS /////////////////
// Select the canvas
const canvas = document.getElementById("myGame");
const context = canvas.getContext("2d");

socket.emit("canvasDim", {
    canvasWidth: canvas.width,
    canvasHeight: canvas.height
});

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

function render(com,user,ball){
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

if (isWKeyPressed) {
    socket.emit("W");
}

if (isSKeyPressed) {
    socket.emit("S");
}
if (isUpKeyPressed) {
    socket.emit("U");
}

if (isDownKeyPressed) {
    socket.emit("D");
}

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

if (isWKeyPressed) {
    socket.emit("W");
}

if (isSKeyPressed) {
    socket.emit("S");
}
if (isUpKeyPressed) {
    socket.emit("U");
}

if (isDownKeyPressed) {
    socket.emit("D");
}

socket.on("init", (data) => {
    render(data.com_name,data.user_name,data.ball_name)
})

socket.on("render", (data) => {
    console.log("rendering")
    render(data.com_name,data.user_name,data.ball_name)
})

socket.on("game_over",()=>{
    drawText("GAME OVER",10,10,black);
} )
