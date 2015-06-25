
var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");

var width = 540, 
	height = 497,
	cubesWide = 24,
	cubesTall = 20, 
	playerSize = 20,
	gridSize = 2, 
	borderSize = 5,
	headerWidth = 45, 
	speed = (playerSize + gridSize);

var keys = [];
var score = 0;
var gameOver = false;

var player = {
	x: borderSize + gridSize,
	y: headerWidth + borderSize + gridSize,
	width: playerSize,
	height: playerSize,
	xdirection: false,
	ydirection: false,
	xnegdirection: false,
	ynegdirection: true
};

var snake = [player];

function snakeConstructor( x , y ) {
	this.x = x;
	this.y = y;
	this.width = playerSize;
	this.height = playerSize;
}

var cubeX = Math.random() * (cubesWide - 1);
var roundCubeX = Math.round(cubeX);

var cubeY = Math.random() * (cubesTall - 1);
var roundCubeY = Math.round(cubeY);

var cube = {
	x: roundCubeX * (player.width + gridSize) + borderSize + gridSize,
	y : roundCubeY * (player.height + gridSize) + borderSize + headerWidth + gridSize,
	width: 20,
	height: 20
};

window.addEventListener("keydown", function(e){
	keys[e.keyCode] = true;
}, false);

window.addEventListener("keyup", function(e){
	delete keys[e.keyCode];
}, false);

function game(){
	
	if( gameOver == false ) {
		update();
	}
	render();
}

function updateSnake() {
	snake.push(new snakeConstructor( player.x, player.y));
}

function shiftSnake() {
	snake.shift();
}

function controller(){

// *******  Set Player Direction  *******

	// ***** Up *****

	if(keys[38] && player.ynegdirection == false) {
		// player.y-=speed;
		player.xdirection = false;
		player.ydirection = true;
		player.xnegdirection = false;
		player.ynegdirection = false;
	}

	// ***** Down *****
	
	if(keys[40] && player.ydirection == false) {
		// player.y+=speed;
		player.xdirection = false;
		player.ydirection = false;
		player.xnegdirection = false;
		player.ynegdirection = true;
	}

	// ***** Right *****
	
	if(keys[37] && player.xdirection == false) {
		// player.x-=speed;
		player.xdirection = false;
		player.ydirection = false;
		player.xnegdirection = true;
		player.ynegdirection = false;
	}

	// ***** Left *****
	
	if(keys[39] && player.xnegdirection == false) {
		// player.x+=speed;
		player.xdirection = true;
		player.ydirection = false;
		player.xnegdirection = false;
		player.ynegdirection = false;
	}
}


function update(){

	updateSnake();
	if(collision(player, cube)) {
		process();
	} else {
		shiftSnake();
	}

	// *******  Player Movement  *******

	if( player.ynegdirection == true ) player.y+=speed;
	if( player.ydirection == true ) player.y-=speed;
	if( player.xnegdirection == true ) player.x-=speed;
	if( player.xdirection == true ) player.x+=speed;


	// Snake Collision

	var snakeTail = snake.slice(1);
	if(snakeTail.length > 1) {
		for( i=0; i < snakeTail.length; i++){
			if(collision(player,snakeTail[i] )) gameOver = true;
		}
	}
	

	// Wall Collision
	
	if(player.x < (borderSize + gridSize)) gameOver = true;
	if(player.y < (borderSize + gridSize + headerWidth)) gameOver = true;
	if(player.x > width - player.width - (borderSize + gridSize)) gameOver = true;
	if(player.y > height - player.height - (borderSize + gridSize)) gameOver = true;
}


function render(){
	// clear canvas
	context.clearRect(0, 0, width, height);
	
	// render header
	context.fillStyle = "#CCFFFF";
	context.fillRect(0, 0, width, headerWidth);
	
	// render border
	context.fillStyle = "black";
	context.fillRect(0, 0, width, borderSize);
	context.fillRect(0, height - borderSize, width, borderSize);
	context.fillRect(0, 0, borderSize, height);
	context.fillRect(width - borderSize, 0, borderSize, height);
	context.fillRect(0, headerWidth, width, borderSize);
	
	// render grid

	renderGrid();

	// render player
	context.fillStyle = "blue";
	if(score >= 10) context.fillStyle = "green";
	for (i=0; i < snake.length; i++) {
		context.fillRect(snake[i].x, snake[i].y, snake[i].width, snake[i].height);
	}
	
	
	// render point
	context.fillStyle = "red";
	context.fillRect(cube.x, cube.y, cube.width, cube.height);
	
	// render header text
	context.fillStyle = "black";
	context.font = "bold 30px helvetica";
	context.fillText(score, 450, 35);
	
	context.fillText("score:", 350, 35);
	context.fillText("Enjoy", 30, 35);

	// render gameOver
	if(gameOver == true) {
		context.fillStyle = "rgba(0,0,0,0.5)";
		context.fillRect(0, 0, 540, 497);

		context.fillStyle = "white";
		context.font = "bold 72px helvetica";
		context.fillText("Game Over", 70, 200);
	}

}

function renderGrid(){
	context.fillStyle = "#CCFFFF";
	for (var i = 0; i < (cubesWide + 1); i++) {
		context.fillRect(borderSize + i * (player.width + gridSize), headerWidth + borderSize, gridSize, height - (headerWidth + (borderSize * 2)));;
	}
	for (var i = 0; i < (cubesTall + 1); i++) {
		context.fillRect(borderSize, headerWidth + borderSize + i * (player.height + gridSize), width - (borderSize * 2), gridSize);
	}
}

function process(){
	score++;
	// cube.x = Math.random() * (width - 30) + 5,
	// cube.y = Math.random() * (height - 75) + 50
	var cubeX = Math.random() * (cubesWide - 1);
	var roundCubeX = Math.round(cubeX);
	cube.x = roundCubeX * (player.width + gridSize) + borderSize + gridSize;

	var cubeY = Math.random() * (cubesTall - 1);
	var roundCubeY = Math.round(cubeY);
	cube.y = roundCubeY * (player.height + gridSize) + borderSize + headerWidth + gridSize;
}

function collision(first, second){
	return !(first.x > second.x + second.width ||
		first.x + first.width < second.x ||
		first.y > second.y + second.height ||
		first.y + first.height < second.y);
}

setInterval(function(){
	game();
}, 1000/10)

setInterval(function(){
	controller();
}, 1000/500)