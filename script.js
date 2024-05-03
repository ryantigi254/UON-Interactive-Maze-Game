
// Initliazing the game
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let playerCanMove = false;


const main = document.querySelector('main');

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Maze Structure provided as a start
//Player = 2, Wall = 1, Enemy = 3, Point = 0
// let maze = [
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//     [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
//     [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
//     [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
//     [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
// ];


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
// Maze Logic that recreates the above array using a mathematical function applied to it to randomize the 3 entities
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let dimensions = 10;

function generateMaze(level, simplicity) {
    
    dimensions = 10 + Math.floor(level / 2);
    if(dimensions>13){
        dimensions = 13
    }
    document.documentElement.style.setProperty('--dimensions', dimensions);

    let maze;
    do {
        console.log("doing")
        maze = generateMazeInternal(dimensions, level, simplicity);
    } while (!isSolvable(maze));

    return maze;

}

function generateMazeInternal(dimensions, level, simplicity) {
    let maze = Array(dimensions).fill().map(() => Array(dimensions).fill(0));

    // Place the player at the top-left corner
    maze[1][1] = 2;

    // Set the border cells to walls
    for (let i = 0; i < dimensions; i++) {
        maze[i][0] = 1;
        maze[i][dimensions - 1] = 1;
        maze[0][i] = 1;
        maze[dimensions - 1][i] = 1;
    }

    // Randomly place walls based on the level and simplicity
    
    const wallProbability = 0.2 + (level * 0.05) - (simplicity * 0.05);
    for (let y = 2; y < dimensions - 2; y++) {
        for (let x = 2; x < dimensions - 2; x++) {
            if (Math.random() < wallProbability && maze[y][x] !== 2) {
                maze[y][x] = 1;
            }
        }
    }

    // Randomly place enemies
    let numEnemies = Math.floor(level / 2) + 2;
    if(numEnemies>3){
        numEnemies = 3;
    }
    for (let i = 0; i < numEnemies; i++) {
        let enemyY, enemyX;
        do {
            enemyY = Math.floor(Math.random() * (dimensions - 2)) + 1;
            enemyX = Math.floor(Math.random() * (dimensions - 2)) + 1;
        } while (maze[enemyY][enemyX] !== 0);
        maze[enemyY][enemyX] = 3;
    }

    // Randomly place points
    const numPoints = Math.floor((dimensions - 2) * (dimensions - 2) * (1 - wallProbability));
    for (let i = 0; i < numPoints; i++) {
        let pointY, pointX;
        do {
            pointY = Math.floor(Math.random() * (dimensions - 2)) + 1;
            pointX = Math.floor(Math.random() * (dimensions - 2)) + 1;
        } while (maze[pointY][pointX] !== 0);
        maze[pointY][pointX] = 0;
    }

    return maze;
}
function isSolvable(maze) {
    for (let y = 1; y < dimensions - 1; y++) {
        for (let x = 1; x < dimensions - 1; x++) {
            if (maze[y][x] === 0 || maze[y][x] === 3) {
                if (
                    maze[y - 1][x] === 1 &&
                    maze[y + 1][x] === 1 &&
                    maze[y][x - 1] === 1 &&
                    maze[y][x + 1] === 1
                ) {
                    return false;
                }
                
                // Check if the point or enemy is accessible by the player
                let accessible = false;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (
                            y + dy >= 0 &&
                            y + dy < dimensions &&
                            x + dx >= 0 &&
                            x + dx < dimensions &&
                            maze[y + dy][x + dx] !== 1 &&
                            maze[y + dy][x + dx] !== 3
                        ) {
                            accessible = true;
                            break;
                        }
                    }
                    if (accessible) break;
                }
                
                if (!accessible) {
                    return false;
                }
            }
        }
    }
    return true;
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
//Populates the maze in the HTML
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


let level = 1;
let simplicity = 1;
let maze = generateMaze(level, simplicity);


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

                let enemyColor = getEnemyColor(y, x);
                let enemy = createEnemyElement(enemyColor);
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


function getEnemyColor(y, x) {
    // Assign colors based on enemy position
    if (y === 1 && x === 8) {
        return 'purple'; // Enemy 1
    } else if (y === 3 && x === 1) {
        return 'darkblue'; // Enemy 2
    } else if (y === 6 && x === 5) {
        return 'darkblue'; // Enemy 3
    } else if (y === 8 && x === 1) {
        return 'magenta'; // Enemy 4 (first enemy)
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to create a new enemy element

function createEnemyElement(color) {
    let enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.setProperty('--enemy-color', color);

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
//*****************************************************************************************************************


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
                updateEnemyColor(enemy, enemy1Color);
            } else if (index === 1) {
                updateEnemyColor(enemy, enemy2Color);
            } else if (index === 2) {
                updateEnemyColor(enemy, enemy3Color);
            } else if (index === 3) {
                updateEnemyColor(enemy, 'orange');
            }
        });
    });
});

function updateEnemyColor(enemy, color) {
    enemy.querySelectorAll('.ear').forEach(ear => ear.style.backgroundColor = color);
    enemy.querySelector('.head-top').style.backgroundColor = color;
    enemy.querySelector('.head').style.backgroundColor = color;
    enemy.querySelector('.body').style.backgroundColor = color;
    enemy.querySelectorAll('.arm').forEach(arm => arm.style.backgroundColor = color);
    enemy.style.setProperty('--enemy-color', color);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
//Player movement operations
////////////////////////////////////////////////////////////////////////////////////////////////////////////

function keyDown(event) {
    if (playerCanMove) {
        event.preventDefault(); // Prevent scrolling
        switch (event.key) {
            case 'ArrowUp':
                upPressed = true;
                break;
            case 'ArrowDown':
                downPressed = true;
                break;
            case 'ArrowLeft':
                leftPressed = true;
                break;
            case 'ArrowRight':
                rightPressed = true;
                break;
        }
    }
}


function keyUp(event) {
    if (playerCanMove) {
        switch (event.key) {
            case 'ArrowUp':
                upPressed = false;
                break;
            case 'ArrowDown':
                downPressed = false;
                break;
            case 'ArrowLeft':
                leftPressed = false;
                break;
            case 'ArrowRight':
                rightPressed = false;
                break;
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

document.getElementById('ubttn').addEventListener('click', () => {
    upPressed = true;
    setTimeout(() => upPressed = false, 100);
});
document.getElementById('rbttn').addEventListener('click', () => {
    rightPressed = true;
    setTimeout(() => rightPressed = false, 100);
});
document.getElementById('dbttn').addEventListener('click', () => {
    downPressed = true;
    setTimeout(() => downPressed = false, 100);
});

const startBtn = document.querySelector('.start');
const startDiv = document.querySelector('.startDiv');

function startGame() {
    startDiv.style.display = 'none';
    playerCanMove = true;


}

startBtn.addEventListener('click', startGame);

////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core Player Movement Logic checking for collisions between the player and walls
////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Old Logic Needs Debugging
/*
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
*/


// New Approach Debugged:

let movement = 3
setInterval(function () {
    if (playerCanMove) {
        let position = player.getBoundingClientRect();
        let nextTop = position.top - (upPressed ? movement: 0) //+ (downPressed ? 1 : 0);
        let nextBottom = position.bottom + (downPressed ? movement : 0) //- (upPressed ? 1 : 0);
        let nextLeft = position.left - (leftPressed ? movement : 0) //+ (rightPressed ? 1 : 0);
        let nextRight = position.right + (rightPressed ? movement : 0) //- (leftPressed ? 1 : 0);

        if (checkWallCollisions(nextTop, nextBottom, nextLeft, nextRight)) {
            if (downPressed) {
                playerTop+=movement

                player.style.top = playerTop + 'px';
                playerMouth.classList = 'down';
                console.log(playerTop)
            } else if (upPressed) {
                playerTop-=movement

                player.style.top = playerTop + 'px';
                playerMouth.classList = 'up';
            } else if (leftPressed) {
                playerLeft-=movement

                player.style.left = playerLeft + 'px';
                playerMouth.classList = 'left';
            } else if (rightPressed) {
                playerLeft+=movement
                player.style.left = playerLeft + 'px';
                playerMouth.classList = 'right';
            }
        }
        function checkWallCollisions(nextTop, nextBottom, nextLeft, nextRight) {
            let topLeftElement = document.elementFromPoint(nextLeft, nextTop);
            let topRightElement = document.elementFromPoint(nextRight, nextTop);
            let bottomLeftElement = document.elementFromPoint(nextLeft, nextBottom);
            let bottomRightElement = document.elementFromPoint(nextRight, nextBottom);
        
            if (downPressed) { 
                if (bottomLeftElement.classList.contains('wall') || bottomRightElement.classList.contains('wall') ){
                    return false;
                }
        
                else {
                    return true;
         
                }
            } 
            else if (upPressed) {
                if (topLeftElement.classList.contains('wall') || topRightElement.classList.contains('wall') ){

                    return false;
                }
        
                else {
                    return true;
         
                }
            } 
            else if (leftPressed) {
                if (topLeftElement.classList.contains('wall') ||  bottomLeftElement.classList.contains('wall') ){
                    return false;
        
                }
        
                else {
                    return true;
         
                }
            } 
            else if (rightPressed) {
                if (bottomRightElement.classList.contains('wall') || topRightElement.classList.contains('wall')) {

                    return false;
        
                }
        
                else {
                    return true;
         
                }
            }
        }
    }
    checkEnemyCollision();
    checkScoreCollisions();
    if (maxScore === 0){
        levelComplete();   
    }
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
    if(maxScore>0){
    if (upPressed) {
        movePlayer(0, -1);
    } else if (downPressed) {
        movePlayer(0, 1);
    } else if (leftPressed) {
        movePlayer(-1, 0);
    } else if (rightPressed) {
        movePlayer(1, 0);
    }}
}, 16); // 16ms = 60fps



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
// Function to check for collisions between the player and enemies
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let lives = 3;
let invulnerable = false;
const enemies = document.querySelectorAll('.enemy');

function checkEnemyCollision() {
    if (invulnerable) return;

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
//*****************************************************************************************************************
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

const gameOverDiv = document.createElement('div');

function showGameOverScreen() {
    gameOverDiv.classList.add('game-over');

    // gameOverMessage.textContent = 'Game Over';
    // gameOverMessage.classList.add('game-over-btn');
    gameOverDiv.textContent = "";
    gameOverDiv.innerHTML += '<br>' +'Game Over'+'<br>';

    
    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Restart';
    restartBtn.classList.add('restart-btn');
    restartBtn.onclick = restartGame;
    gameOverDiv.appendChild(restartBtn);

    startDiv.innerHTML = '';
    startDiv.appendChild(gameOverDiv);
    startDiv.style.display = 'flex';
}


function restartGame() {
    window.location.reload();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
//Nxt Level
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function levelComplete() {
    playerCanMove = false;
    showNextLevelScreen();
    
}

const levelCompleteDiv = document.createElement('div');
const enterNameDiv = document.createElement('div');

function showGameOverScreen() {
    gameOverDiv.classList.add('game-over');
    gameOverDiv.textContent = "";
    gameOverDiv.innerHTML += '<br>' +'Game Over'+'<br>';

    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Restart';
    restartBtn.classList.add('restart-btn');
    restartBtn.onclick = restartGame;
    gameOverDiv.appendChild(restartBtn);

    startDiv.innerHTML = '';
    startDiv.appendChild(gameOverDiv);
    startDiv.style.display = 'flex';
}

function showNextLevelScreen() {
    levelCompleteDiv.classList.add('level-complete');
    levelCompleteDiv.textContent = "";
    levelCompleteDiv.innerHTML += '<br>' + 'Level Complete ' + '<br>';

    const nextLevelBtn = document.createElement('button');
    nextLevelBtn.textContent = 'Next Level';
    nextLevelBtn.classList.add('restart-btn');
    nextLevelBtn.onclick = nextLevel;
    levelCompleteDiv.appendChild(nextLevelBtn);

    const enterNameBtn = document.createElement('button');
    enterNameBtn.textContent = 'Enter Name';
    enterNameBtn.classList.add('restart-btn');
    enterNameBtn.onclick = showEnterNameScreen;
    levelCompleteDiv.appendChild(enterNameBtn);

    startDiv.innerHTML = '';
    startDiv.appendChild(levelCompleteDiv);
    startDiv.style.display = 'flex';

    // Set a timer to automatically go to the next level after 10 seconds
    setTimeout(startNextLevel, 10000);
}

function showEnterNameScreen() {
    enterNameDiv.classList.add('enter-name');
    enterNameDiv.innerHTML = '<br>Enter your name:<br><input type="text" id="nameInput"><br>';
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    submitBtn.onclick = submitName;
    enterNameDiv.appendChild(submitBtn);

    startDiv.innerHTML = '';
    startDiv.appendChild(enterNameDiv);
    startDiv.style.display = 'flex';
}

function submitName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value;
    // Do something with the entered name
    console.log('Name entered:', name);
    nextLevel();
}

function nextLevel() {
    level++;
    simplicity -= 0.12;
    

}



////////////////////////////////////////////////////////////////////////////////////////////////////////////


updateLivesDisplay();

////////////////////////////////////////////////////////////////////////////////////////////////////////////

// this is the initial color setting of the enemy

enemies.forEach((enemy) => {
    enemy.querySelectorAll('.ear').forEach(ear => ear.style.backgroundColor = "purple");
    enemy.querySelector('.head-top').style.backgroundColor = "purple";
    enemy.querySelector('.head').style.backgroundColor = "purple";
    enemy.querySelector('.body').style.backgroundColor = "purple";
    enemy.querySelectorAll('.arm').forEach(arm => arm.style.backgroundColor = "purple");
    enemy.style.setProperty('--enemy-color', "purple");

})

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
// //Score Functionality

// Initialize the score variable
let score = 0;
let maxScore = document.querySelectorAll('.point').length-40

console.log(maxScore)
// Make sure to update the score display in your game

function checkScoreCollisions() {
    const playerRect = player.getBoundingClientRect();
    const points = document.querySelectorAll('.point');
    for (let point of points) {
        const pointRect = point.getBoundingClientRect();
        if (playerRect.left < pointRect.right && playerRect.right > pointRect.left &&
            playerRect.top < pointRect.bottom && playerRect.bottom > pointRect.top) {
            point.classList.remove('point');
            score += 5;
            maxScore--;
            console.log(maxScore)

            updateScoreDisplay();
            break;
        }
    }
}

function updateScoreDisplay() {
    const scoreElement = document.querySelector('.score p');
    scoreElement.textContent = score;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
// // Leaderboard Functionality 


function showLeaderboardScreen() {
    const leaderboardDiv = document.createElement('div');
    leaderboardDiv.classList.add('leaderboard-screen');

    const message = document.createElement('p');
    message.textContent = 'Enter your name for the leaderboard:';
    leaderboardDiv.appendChild(message);

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.maxLength = 10;
    nameInput.classList.add('leaderboard-input');
    leaderboardDiv.appendChild(nameInput);

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    submitBtn.classList.add('leaderboard-btn');
    submitBtn.onclick = () => {
        const playerName = nameInput.value.trim();
        if (playerName) {
            saveLeaderboardEntry(playerName);
        }
        startNextLevel();
    };
    leaderboardDiv.appendChild(submitBtn);

    startDiv.innerHTML = '';
    startDiv.appendChild(leaderboardDiv);
    startDiv.style.display = 'flex';

    nameInput.focus();
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
// //Enemy movement

////////////////////////////////////////////////////////////////////////////////////////////////////////////


