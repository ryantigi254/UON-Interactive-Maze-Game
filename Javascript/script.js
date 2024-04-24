////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initliazing the game

let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let playerCanMove = false;



const main = document.querySelector('main');

//Player = 2, Wall = 1, Enemy = 3, Point = 0
let maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 3, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

//Populates the maze in the HTML
for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
        let block = document.createElement('div');
        block.classList.add('block');

        switch (maze[y][x]) {
            case 1:
                block.classList.add('wall');
                break;
            case 2:
                block.id = 'player';
                let mouth = document.createElement('div');
                mouth.classList.add('mouth');
                block.appendChild(mouth);
                break;
            case 3:
                // Create the enemy
                let enemyContainer = document.createElement('div');
                enemyContainer.classList.add('enemy-container');
                block.appendChild(enemyContainer);

                let enemy = createEnemyElement();
                enemyContainer.appendChild(enemy);
                break;
            default:
                block.classList.add('point');
                block.style.height = '1vh';
                block.style.width = '1vh';
                    if (maze[y][x] !== 3) {
            block.classList.add('point');
            block.style.height = '1vh';
            block.style.width = '1vh';
        }     
        }   

        main.appendChild(block);
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to create a new enemy element

function createEnemyElement() {
    let enemy = document.createElement('div');
    enemy.classList.add('enemy');

    let earLeft = document.createElement('div');
    earLeft.classList.add('ear', 'ear-left');
    enemy.appendChild(earLeft);

    let earRight = document.createElement('div');
    earRight.classList.add('ear', 'ear-right');
    enemy.appendChild(earRight);

    let headTop = document.createElement('div');
    headTop.classList.add('head-top');
    enemy.appendChild(headTop);

    let head = document.createElement('div');
    head.classList.add('head');
    enemy.appendChild(head);

    let eyeLeft = document.createElement('div');
    eyeLeft.classList.add('eye', 'eye-left');
    head.appendChild(eyeLeft);

    let eyeRight = document.createElement('div');
    eyeRight.classList.add('eye', 'eye-right');
    head.appendChild(eyeRight);

    let body = document.createElement('div');
    body.classList.add('body');
    enemy.appendChild(body);

    let armLeft = document.createElement('div');
    armLeft.classList.add('arm', 'arm-left');
    enemy.appendChild(armLeft);

    let armRight = document.createElement('div');
    armRight.classList.add('arm', 'arm-right');
    enemy.appendChild(armRight);

    return enemy;
}

// Function to position the enemies correctly
function positionEnemies() {
    const enemies = document.querySelectorAll('.enemy-container');
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        let block = enemy.parentNode;
        let blockRect = block.getBoundingClientRect();
        enemy.style.top = `${blockRect.top}px`;
        enemy.style.left = `${blockRect.left}px`;
    }
}

positionEnemies();

function positionEnemies() {
    const enemies = document.querySelectorAll('.enemy-container');
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        let block = enemy.parentNode;
        let blockRect = block.getBoundingClientRect();
        let x = blockRect.left + (blockRect.width - enemy.offsetWidth) / 2;
        let y = blockRect.top + (blockRect.height - enemy.offsetHeight) / 2;
        enemy.style.top = `${y}px`;
        enemy.style.left = `${x}px`;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // Game Features
const colorOptions = document.querySelectorAll('.color-option');
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        const playerColor = option.getAttribute('data-player-color');
        const enemy1Color = option.getAttribute('data-enemy1-color');
        const enemy2Color = option.getAttribute('data-enemy2-color');
        const enemy3Color = option.getAttribute('data-enemy3-color');

        player.style.backgroundColor = playerColor;

        const enemies = document.querySelectorAll('.enemy');
        enemies.forEach((enemy, index) => {
            if (index === 0) {
                enemy.style.backgroundColor = enemy1Color;
            } else if (index === 1) {
                enemy.style.backgroundColor = enemy2Color;
            } else if (index === 2) {
                enemy.style.backgroundColor = enemy3Color;
            }
        });
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Player movement
function keyDown(event) {
    if (playerCanMove) {
        event.preventDefault(); // Prevent scrolling
        switch (event.key) {
            case 'ArrowUp': upPressed = true; break;
            case 'ArrowDown': downPressed = true; break;
            case 'ArrowLeft': leftPressed = true; break;
            case 'ArrowRight': rightPressed = true; break;
        }
    }
}


function keyUp(event) {
    if (playerCanMove) {
        switch (event.key) {
            case 'ArrowUp': upPressed = false; break;
            case 'ArrowDown': downPressed = false; break;
            case 'ArrowLeft': leftPressed = false; break;
            case 'ArrowRight': rightPressed = false; break;
        }
    }
}

const player = document.querySelector('#player');
const playerMouth = player.querySelector('.mouth');
let playerTop = 0;
let playerLeft = 0;


document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
document.getElementById('lbttn').addEventListener('click', () => {
    if (playerCanMove) {
      leftPressed = true;
      setTimeout(() => leftPressed = false, 100);
    }
  });

document.getElementById('ubttn').addEventListener('click', () => {upPressed = true; setTimeout(() => upPressed = false, 100);});
document.getElementById('rbttn').addEventListener('click', () => {rightPressed = true; setTimeout(() => rightPressed = false, 100);});
document.getElementById('dbttn').addEventListener('click', () => {downPressed = true; setTimeout(() => downPressed = false, 100);});

const startBtn = document.querySelector('.start');
const startDiv = document.querySelector('.startDiv');

function startGame() {
    startDiv.style.display = 'none';
    playerCanMove = true;
    moveEnemies(); 
  }

startBtn.addEventListener('click', startGame);

////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to check for collisions between the player and walls

////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Core Player Movement Logic

setInterval(function () {
    if (playerCanMove) {
        let position = player.getBoundingClientRect();
        let nextTop = position.top - (upPressed ? 1 : 0) + (downPressed ? 1 : 0);
        let nextBottom = position.bottom + (downPressed ? 1 : 0) - (upPressed ? 1 : 0);
        let nextLeft = position.left - (leftPressed ? 1 : 0) + (rightPressed ? 1 : 0);
        let nextRight = position.right + (rightPressed ? 1 : 0) - (leftPressed ? 1 : 0);

        if (checkWallCollisions(nextTop, nextBottom, nextLeft, nextRight)) {
            if (downPressed) {
                playerTop++;
                player.style.top = playerTop + 'px';
                playerMouth.classList = 'down';
            } else if (upPressed) {
                playerTop--;
                player.style.top = playerTop + 'px';
                playerMouth.classList = 'up';
            } else if (leftPressed) {
                playerLeft--;
                player.style.left = playerLeft + 'px';
                playerMouth.classList = 'left';
            } else if (rightPressed) {
                playerLeft++;
                player.style.left = playerLeft + 'px';
                playerMouth.classList = 'right';
            }
        }
    }
    checkEnemyCollision();
    checkScoreCollisions(); 
}, 1);

// Define a grid-based collision detection system
const gridSize = 10;
const grid_00 = [];
for (let y = 0; y < maze.length; y++) {
  grid_00[y] = [];
  for (let x = 0; x < maze[y].length; x++) {
    grid_00[y][x] = maze[y][x] === 1 ? 'wall' : 'empty';
  }
}

// Define a function to check for collisions
function checkCollision(x, y) {
  if (x < 0 || x >= maze[0].length || y < 0 || y >= maze.length) {
    return true; // out of bounds
  }
  return grid_00[y][x] === 'wall';
}

// Update the player movement logic
function movePlayer(dx, dy) {
  const newX = playerLeft + dx;
  const newY = playerTop + dy;
  if (!checkCollision(newX, newY)) {
    playerLeft = newX;
    playerTop = newY;
  }
}

// Update the game loop to use the new movement logic
setInterval(() => {
  if (upPressed) {
    movePlayer(0, -1);
  } else if (downPressed) {
    movePlayer(0, 1);
  } else if (leftPressed) {
    movePlayer(-1, 0);
  } else if (rightPressed) {
    movePlayer(1, 0);
  }
}, 16); // 16ms = 60fps

function checkWallCollisions(nextTop, nextBottom, nextLeft, nextRight) {
    let topLeftElement = document.elementFromPoint(nextLeft, nextTop);
    let topRightElement = document.elementFromPoint(nextRight, nextTop);
    let bottomLeftElement = document.elementFromPoint(nextLeft, nextBottom);
    let bottomRightElement = document.elementFromPoint(nextRight, nextBottom);

    if (topLeftElement.classList.contains('wall') || 
        topRightElement.classList.contains('wall') ||
        bottomLeftElement.classList.contains('wall') ||
        bottomRightElement.classList.contains('wall')) {
        return false;
    }
    return true;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to check for collisions between the player and enemies

let lives = 3; 
let invulnerable = false; 

function checkEnemyCollision() {
    if (invulnerable) return;

    const enemies = document.querySelectorAll('.enemy');
    const playerRect = player.getBoundingClientRect();

    for (let enemy of enemies) {
        const enemyRect = enemy.getBoundingClientRect();
        if (playerRect.left < enemyRect.right && playerRect.right > enemyRect.left &&
            playerRect.top < enemyRect.bottom && playerRect.bottom > enemyRect.top) {
            player.classList.add('hit');
            setTimeout(() => player.classList.remove('hit'), 1500); 
            
            lives--;
            updateLivesDisplay();
            makePlayerInvulnerable(); 

            if (lives === 0) {
                gameOver();
                player.classList.remove('hit');
                player.classList.add('dead');            
            }
            break; 
        }
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Core gameplay logic
function makePlayerInvulnerable() {
    invulnerable = true;
    setTimeout(() => {
        invulnerable = false;
    }, 1500); 
}



function updateLivesDisplay() {
    const livesList = document.querySelector('.lives ul');
    livesList.innerHTML = ''; 
    for (let i = 0; i < lives; i++) {
        const life = document.createElement('li');
        livesList.appendChild(life);
    }
}

function gameOver() {
    playerCanMove = false;
    player.classList.add('dead'); 
    playerMouth.style.display = 'none'; 
    showGameOverScreen();
}

function showGameOverScreen() {
    const gameOverDiv = document.createElement('div');
    gameOverDiv.classList.add('game-over'); 
    
    const gameOverMessage = document.createElement('h1');
    gameOverMessage.textContent = 'Game Over';
    gameOverMessage.classList.add('game-over-btn'); 
    gameOverDiv.appendChild(gameOverMessage);
    
    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Restart';
    restartBtn.classList.add('restart-btn'); 
    restartBtn.onclick = restartGame;
    gameOverDiv.appendChild(restartBtn);
    
    startDiv.innerHTML = ''; 
    startDiv.appendChild(gameOverDiv);
    startDiv.style.display = 'flex'; 
}

const gameOverMessage = document.createElement('h1');
gameOverMessage.textContent = 'Game Over';
gameOverMessage.classList.add('game-over-text'); 
gameOverDiv.appendChild(gameOverMessage);


function restartGame() {
    window.location.reload(); 
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////


updateLivesDisplay();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //Enemy movement

function moveEnemies() {
    if (!playerCanMove) return;
  
    const enemies = document.querySelectorAll('.enemy-container');
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const currentNode = getNodeFromBlock(enemy.parentNode);
      const playerNode = getNodeFromBlock(player.parentNode);
      const path = findPath(currentNode, playerNode, maze);
  
      if (path.length > 0) {
        const nextNode = path[0];
        const nextBlock = getBlockFromNode(nextNode);
  
        if (!nextBlock.classList.contains('wall') && !nextBlock.querySelector('.enemy-container')) {
          enemy.parentNode.removeChild(enemy);
          nextBlock.appendChild(enemy);
          positionEnemies();
        }
      }
    }
  
    setTimeout(moveEnemies, 500);
  }

  function getBlockFromNode(node) {
    return document.querySelector(`.block:nth-child(${node.y * maze[0].length + node.x + 1})`);
  }
  
  function getNodeFromBlock(block) {
    const x = Array.from(block.parentNode.children).indexOf(block) % maze[0].length;
    const y = Math.floor(Array.from(block.parentNode.children).indexOf(block) / maze[0].length);
    return maze[y][x];
  }

  function generateMaze() {
    // Randomize enemy positions
    const enemyPositions = [];
    while (enemyPositions.length < 3) {
      const x = Math.floor(Math.random() * maze[0].length);
      const y = Math.floor(Math.random() * maze.length);
      if (!maze[y][x].isWall && !enemyPositions.some(pos => pos.x === x && pos.y === y)) {
        enemyPositions.push({ x, y });
      }
    }
  
    for (const { x, y } of enemyPositions) {
      maze[y][x].isEnemy = true;
    }
  }
  const restartBtn = document.createElement('button');
restartBtn.textContent = 'Restart';
restartBtn.classList.add('restart-btn');
restartBtn.addEventListener('click', restartGame);
gameOverDiv.appendChild(restartBtn);

function restartGame() {
  lives = 3;
  score = 0;
  playerCanMove = false;
  player.classList.remove('dead', 'hit');
  playerMouth.style.display = 'block';
  startDiv.style.display = 'flex';
  gameOverDiv.remove();

  main.innerHTML = '';
  generateMaze();
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //Score Functionality

let score = 0;

function checkScoreCollisions() {
    const playerRect = player.getBoundingClientRect();
    const points = document.querySelectorAll('.point');

    for (let point of points) {
        const pointRect = point.getBoundingClientRect();
        if (playerRect.left < pointRect.right && playerRect.right > pointRect.left &&
            playerRect.top < pointRect.bottom && playerRect.bottom > pointRect.top) {
            point.classList.remove('point');
            score += 5;
            updateScoreDisplay();
            break; 
        }
    }
}

function updateScoreDisplay() {
    const scoreElement = document.querySelector('.score p');
    scoreElement.textContent = `Score: ${score}`; 
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////














