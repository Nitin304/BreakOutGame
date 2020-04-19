var canvas = document.getElementById('myApp');
var ctx = canvas.getContext('2d');
//2d context provides the context for canvas drawing


var x=canvas.width/2;
var y=canvas.height - 30;

var dx=2;
var dy = -2;

var ballRadius=10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddlex = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;

var brickRowCount =3;
var brickColumnCount =5;
var bHeight = 20;
var bWidth = 75;
var bPadding =10;
var bOffsetTop = 30;
var bOffLeft=30;

var score = 0;
var lives = 3;
var level = 1;
var maxLevel =5;


var bricks = [];
initBricks();
function initBricks(){
    for(let c=0;c<brickColumnCount;c++){
        bricks[c] = [];
        for(let r = 0;r<brickRowCount;r++){
            bricks[c][r] = {x:0,y:0,status:1};   
        }
    }
}


document.addEventListener("keydown",keyDownHandler);
document.addEventListener("keyup",keyUpHandler);

function drawBricks(){
    for(let c = 0;c<brickColumnCount;c++){
        for(let r = 0;r<brickRowCount;r++){
            if(bricks[c][r].status ==1){
                var brickx = c*(bWidth+bPadding)+bOffLeft;
                var bricky = r*(bHeight+bPadding)+bOffsetTop;
                bricks[c][r].x = brickx;
                bricks[c][r].y = bricky;
                ctx.beginPath();
                ctx.rect(brickx,bricky,bWidth,bHeight);
                ctx.fillStyle="#0095DD";
                ctx.fill();
                ctx.closePath();
            }           
        }
    }
}
 
function keyDownHandler(e){
    if(e.keyCode ==39){
        rightPressed = true;
    }
    else if(e.keyCode ==37){
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if(e.keyCode ==39){
        rightPressed = false;
    }
    else if(e.keyCode ==37){
        leftPressed = false;
    }
}

function drawball(){
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0, Math.PI*2,false);
    ctx.fillStyle="#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddlex,canvas.height-paddleHeight, paddleWidth,paddleHeight);
    ctx.fillStyle="#0095DD";
    ctx.fill();
    ctx.closePath();
}

function collisionDetection(){
    for(let c=0;c<brickColumnCount;c++){
        for(let r = 0;r<brickRowCount;r++){
            var b = bricks[c][r];
            if( b.status ==1){
                if(x>b.x && x<(b.x+bWidth) && y>b.y && y<(b.y+bHeight)){
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount){
                        if(level==maxLevel){
                            alert("Congratulations! You have won the game.");
                            document.location.reload();
                        }
                        else{
                            level++;
                            //Start the next level
                            initBricks();
                        }
                    }
                }
            }
            
        }
    }
}

function drawScore(){
    ctx.font="16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score:"+score,8,20);
}

function drawLives(){
    ctx.font="16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives Left:"+lives,canvas.width-100,20);
}

function drawLevel(){
    ctx.font="16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level:"+level,210,20);
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawball(); 
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives();
    drawLevel();

    if(y +dy< ballRadius){
        dy=-dy;
    }
    else if(y+dy>canvas.height-ballRadius){
        if(x>paddlex && x<paddlex+paddleWidth){
            dy=-dy;
        }
        else{
            lives--;
            if(!lives){
                alert("Game Over");
                document.location.reload();
            }
            else{
                x= canvas.width/2;
                y=canvas.height/2;
                paddlex = (canvas.width-paddleWidth)/2;
            }
            
        }
        
    }

    if(x +dx<ballRadius || x +dx>canvas.width-ballRadius){
        dx=-dx;
    }

    if(rightPressed && paddlex<canvas.width-paddleWidth){
        paddlex +=7;
    }
    if(leftPressed && paddlex>0){
        paddlex -=7;
    }
    
    x+= dx;
    y+=dy;
    requestAnimationFrame(draw);
};

document.addEventListener("mousemove",mouseMoveHandler);
function mouseMoveHandler(e){
    var relativeX = e.clientX -canvas.offsetLeft;
    if(relativeX>0+paddleWidth/2&& relativeX<canvas.width-paddleWidth/2){
        paddlex = relativeX -paddleWidth/2;
    }
}
draw();