var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height - 30;;
var dx = 2;
var dy = -2;
var ballRadius = 8;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

var blockRowCount = 4;
var blockColumnCount = 5;
var blockWidth = (canvas.width / blockColumnCount) * 0.78;
var blockHeight = ((canvas.height/2) / blockRowCount) * 0.5;
var blockPadding = 10;
var blockOffsetTop = 30;
var blockOffsetLeft = 30;

var score = 0;
var life = 2;

var blocks =[];

for(var c=0; c<blockColumnCount; c++){
  blocks[c] = [];
  for(var r=0; r<blockRowCount; r++){
    blocks[c][r] = {x: 0, y: 0, status: 1};
  }
}

//スコアを描画
function drawScore(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "#00c5fD";
  ctx.fillText("Score:" + score, 8, 20);
}

//ライフを描画
function drawLifes(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "#00c5fD";
  ctx.fillText("life:" + life, canvas.width - 65, 20);
}

//ボールを描画
function drawBall(){
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

//パドルを描画
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

//ブロックを描画
function drawBlock(){
    for(var c=0; c<blockColumnCount; c++){
      for(var r=0; r<blockRowCount; r++){
        if(blocks[c][r].status == 1){
          var blockX = (c * (blockWidth + blockPadding)) + blockOffsetLeft;
          var blockY = (r * (blockHeight + blockPadding)) + blockOffsetTop;
          blocks[c][r].x = blockX;
          blocks[c][r].y = blockY;
        
          ctx.beginPath();
          ctx.rect(blockX, blockY, blockWidth, blockHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
}

//ボールの衝突
function collisionDetection(){
  for(var c=0; c<blockColumnCount; c++){
    for(var r=0; r<blockRowCount; r++){
      var b = blocks[c][r];
      if(b.status == 1){
        if(x > b.x && x <b.x + blockWidth && y > b.y && y < b.y + blockHeight){
          b.status = 0;
          dy = -dy * 1.1;
          score++;
          //ブロックが全て消えたときの処理
          if(score == blockColumnCount * blockRowCount){
            alert("YOU WIN CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}
//アニメーション
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawScore();
  drawLifes();
  drawBall();
  drawPaddle();
  drawBlock();
  collisionDetection();

  if(y - ballRadius < 0){
    dy = -dy;
  }else if(y + ballRadius > canvas.height){
    if(x > paddleX && x < paddleX+paddleWidth){
      if(y = y - paddleHeight){
          dy = -dy;
      }
    }else{
      life--;
      if(!life){
        alert('GAME OVER');
        document.location.reload();
      }else{
        alert("残り" + life + "球");
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
      
  }
  if(x - ballRadius < 0 || x + ballRadius > canvas.width){
    dx = -dx;
  }

  if(rightPressed && paddleX + paddleWidth <= canvas.width){
      paddleX += 7;
  }else if(leftPressed && paddleX >= 0){
      paddleX -= 7;
  }

  x += dx;
  y += dy;

  var span = document.getElementById("speed").innerText = Math.abs(dy).toFixed(1);

  requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e){
    //== "right"はIE/Edgeにも対応する為
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = true;
    }else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = true;
    }
}

function keyUpHandler(e){
    //== "right"はIE/Edgeにも対応する為
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = false;
    }else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = false;
    }
}

function mouseMoveHandler(e){
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width){
    paddleX = relativeX - paddleWidth / 2;
  }
}

draw();