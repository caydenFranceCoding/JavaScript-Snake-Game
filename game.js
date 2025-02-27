console.log("Game JS loaded!");

// first, i will get the canvas and set up the context for drawing

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

//game settings
const gridSize = 20; // each grid square is going to be 20x20
const tileCount = canvas.width / gridSize // how many tiles will be on screen.

//game state
let snake = [
  { x: 10, y: 10 } // starting pos opf the snakes head with an array of objects
];
let food = {
  x: 15,
  y: 15
};
let dx = 0; //direction x (horizontal movement)
let dy = 0; // direction y (vert movement)
let score = 0;
let gameStarted = false;
let gameOver = false;

//this will get our buttons
const startButton = document.getElementById('startBtn');
const resetButton = document.getElementById('resetBtn');

// Debug: Check if elements are found
console.log("Canvas found:", !!canvas);
console.log("Start button found:", !!startButton);
console.log("Reset button found:", !!resetButton);

//add click listeners to the buttons
startButton.addEventListener('click', () => {
  console.log("start button was clicked!");
  startGame()
});

resetButton.addEventListener('click', () => {
  console.log("reset button was clicked!");
  resetGame()
});

function startGame() {
  console.log("startGame function called");
  if(!gameStarted) {
    console.log("Game starting...");
    gameStarted = true;
    gameLoop();
  }
}

function resetGame() {
  //this is to reset everything back to the normal starting state
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  score = 0;
  gameStarted = false
  gameOver = false
  generateFood();
  drawGame(); // this will draaw it back to inital state;
  document.getElementById('score').textContent = `Score: ${score}`;
}

function generateFood() {
  //generate random cords for food
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);

  // this is going to make sure the food doesnt spawn on the snake
  snake.forEach(part => {
    if(part.x === food.x && part.y === food.y) {
      generateFood(); //try to spawn food again if it spawns on snake
    }
  })
}

// this will be the keyboard controls
document.addEventListener('keydown', function(event) {
    if (!gameStarted) return;

    switch(event.key) {
        case 'ArrowUp':
            if (dy === 1) return;
            dx = 0;
            dy = -1;
            break;
        case 'ArrowDown':
            if (dy === -1) return;
            dx = 0;
            dy = 1;
            break;
        case 'ArrowLeft':
            if (dx === 1) return;
            dx = -1;
            dy = 0;
            break;
        case 'ArrowRight':
            if (dx === -1) return;
            dx = 1;
            dy = 0;
            break;
    }
});

function gameLoop() {
  if (gameOver) return;

  //this will move the snake
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head); // this adds a new head

  // check if the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    document.getElementById('score').textContent = `Score: ${score}`;
    generateFood();
  } else {
    snake.pop(); // this will remove tail if no food gets eaten
  }

  // checks for collisions
  if(checkCollision()) {
    gameOver = true;
    alert(`Game Over! Score: ${score}`);
    return;
  }

  // clear canvas and draws everything
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGame();

  //continue the loop
  setTimeout(gameLoop, 100); // this adjust speed by changing the timeout
}

function checkCollision() {
  const head = snake[0];

  //check for wall collision
  if(!snake.length || !head) {
    return false;
  }

  if(head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ) {
    return true;
  }

  //check for self collision (starts from 1 to skip head)
  for(let i = 1; i < snake.length; i++) {
    if(snake[i] && head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

function drawGame() {
  //draws the snake
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? '#4CAF50' : '#2E7D32'; // head is gonna be lighter green
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
  });

  // draw the food
  ctx.fillStyle = '#FF5000';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}
