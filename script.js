
// Initliazing the game
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let playerCanMove = false;
localStorage.removeItem('leaderboard');

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
document.documentElement.style.setProperty('--dimensions', dimensions);

function generateMaze(level, simplicity) {
    if (level <= 5) {
        dimensions = 10;
    } else {
        dimensions = 10 + Math.floor(level / 2);
        if (dimensions > 13) {
            dimensions = 13;
        }
    }
    // document.documentElement.style.setProperty('--dimensions', dimensions);
    let maze;
    do {
        console.log("doing")
        maze = generateMazeInternal(dimensions, level, simplicity);
    } while (!isSolvable(maze));
    return maze;
}

function generateMazeInternal(dimensions, level, simplicity) {
    let maze = Array(dimensions).fill().map(() => Array(dimensions).fill(0));
    maze[1][1] = 2;
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
    let numEnemies = 3;
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



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
//Populates the maze in the HTML
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let level = 1;
let simplicity = 1;
let maze = generateMaze(level, simplicity);



function MazePopulator(){
    
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
    setColorOptions();
}}

MazePopulator()
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
// Function to create a new enemy element
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

// Alternative method for positioning Enemies correctly
// function positionEnemies() {
//     const enemies = document.querySelectorAll('.enemy-container');
//     for (let i = 0; i < enemies.length; i++) {
//         let enemy = enemies[i];
//         let block = enemy.parentNode;
//         let blockRect = block.getBoundingClientRect();
//         enemy.style.top = `${blockRect.top}px`;
//         enemy.style.left = `${blockRect.left}px`;
//     }
// }

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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//*****************************************************************************************************************
// // Game Features
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setColorOptions() {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            const playerColor = option.getAttribute('data-player-color');
            const enemy1Color = option.getAttribute('data-enemy1-color');
            const enemy2Color = option.getAttribute('data-enemy2-color');
            const enemy3Color = option.getAttribute('data-enemy3-color');

            const player = document.querySelector('#player');
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
}

function updateEnemyColor(enemy, color) {
    const earElements = enemy.querySelectorAll('.ear');
    earElements.forEach(ear => ear.style.backgroundColor = color);

    const headTopElement = enemy.querySelector('.head-top');
    if (headTopElement) {
        headTopElement.style.backgroundColor = color;
    }

    const headElement = enemy.querySelector('.head');
    if (headElement) {
        headElement.style.backgroundColor = color;
    }

    const bodyElement = enemy.querySelector('.body');
    if (bodyElement) {
        bodyElement.style.backgroundColor = color;
    }

    const armElements = enemy.querySelectorAll('.arm');
    armElements.forEach(arm => arm.style.backgroundColor = color);

    enemy.style.setProperty('--enemy-color', color);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
    updateLeaderboard();
    updateChecklist();
}

startBtn.addEventListener('click', startGame);

function updatePlayerMouth() {
    if (downPressed) {
        playerMouth.classList = 'down';
    } else if (upPressed) {
        playerMouth.classList = 'up';
    } else if (leftPressed) {
        playerMouth.classList = 'left';
    } else if (rightPressed) {
        playerMouth.classList = 'right';
    }
}
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
    // Auto-click the "yellow" player color
    const yellowOption = document.querySelector('[data-player-color="yellow"]');
    yellowOption.click();
    updateChecklist(); // Call the updateChecklist function
    updateChecklistAfterLevels(); 
    let player = document.querySelector('#player');

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
            } else if (upPressed) {
                playerTop-=movement
                player.style.top = playerTop + 'px';
            } else if (leftPressed) {
                playerLeft-=movement
                player.style.left = playerLeft + 'px';
            } else if (rightPressed) {
                playerLeft+=movement
                player.style.left = playerLeft + 'px';
            }
            updatePlayerMouth();
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
        maxScore++
        levelComplete();   
    }
        if (downPressed) {
        playerMouth.classList = 'down';
    } else if (upPressed) {
        playerMouth.classList = 'up';
    } else if (leftPressed) {
        playerMouth.classList = 'left';
    } else if (rightPressed) {
        playerMouth.classList = 'right';
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
// Function to check for collisions between the player and enemies
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let lives = 3;
let invulnerable = false;
let enemies = document.querySelectorAll('.enemy');

function checkEnemyCollision() {
    if (invulnerable) return;

    const playerRect = player.getBoundingClientRect();
    let enemies = document.querySelectorAll('.enemy');
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
// Level Complete Functionality Game Over Screen and Next Level
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function levelComplete() {
    playerCanMove = false;
    showNextLevelScreen();
    playerMouth.style.display = 'none';
    
}

const levelCompleteDiv = document.createElement('div');


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
    startDiv.classList.remove('startDiv');
    startDiv.classList.add('level-complete');
    startDiv.innerHTML = `
      <h2>Level Complete</h2>
      <div class="button-container">
        ${level === 1 ? '<button class="restart-btn" onclick="showEnterNameScreen()">Enter Your Name</button>' : ''}
        <button class="restart-btn" onclick="nextLevel()">Next Level</button>
      </div>
    `;
    startDiv.style.display = 'flex';
}


function showEnterNameScreen() {
    startDiv.classList.remove('startDiv');
    startDiv.classList.add('enter-name');
    startDiv.innerHTML = `
        <h2>Enter Your Name</h2>
        <div class="input-container">
            <input type="text" id="nameInput" placeholder="Your Name">
            <button class="restart-btn" onclick="submitName()">Submit</button>
        </div>
    `;
}

function submitName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    if (name) {
      saveLeaderboardEntry(name, score);
      updateLeaderboard();
      score = 0; // Reset the score for the next level
      nextLevel();
    }
}

function saveLeaderboardEntry(name, score) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function nextLevel() {
    enemies = document.querySelectorAll('.enemy');
    const yellowOption = document.querySelector('[data-player-color="yellow"]');

    level++;
    simplicity -= 0.12;
    startDiv.style.display = 'none';
    console.log("Current Level: " + level);

    if (level <= 5) {
        dimensions = 10;
    } else {
        dimensions = 10 + Math.floor(level / 2);
        if (dimensions > 13) {
            dimensions = 13;
        }
    }
    updatePlayerMouth();

    document.documentElement.style.setProperty('--dimensions', dimensions);
    maze = generateMaze(level, simplicity);
    main.innerHTML = '';

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
            }

            main.appendChild(block);
        }
    }
    
    maxScore = document.querySelectorAll('.point').length-40
    playerTop = 0;
    playerLeft = 0;
    upPressed = false;
    downPressed = false;
    leftPressed = false;
    rightPressed = false;
    playerCanMove = true;
    updateScoreDisplay();
    updateLivesDisplay();
    positionEnemies();
    getEnemyColor();
    updateLeaderboard();
    updateChecklist();
    resetChecklist();
    yellowOption.click();
    setColorOptions();  
    updateEnemyColor();  
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

updateLivesDisplay();

////////////////////////////////////////////////////////////////////////////////////////////////////////////


 
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
// //Score Functionality
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initialize the score variable
let score = 0;
let maxScore = document.querySelectorAll('.point').length-40


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


////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
// // Leaderboard Functionality 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateLeaderboard() {
    const leaderboardList = document.querySelector('.leaderboard ol');
    leaderboardList.innerHTML = '';
  
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard = leaderboard.slice(0, 6); // Limit to 6 entries
    leaderboard.forEach((entry, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${entry.name}........${entry.score}`;
      leaderboardList.appendChild(listItem);
    });
  
    // Add the default leaderboard entries
    const defaultEntries = [
      { name: 'Chris', score: 100 },
      { name: 'Mark', score: 75 },
      { name: 'Tom', score: 50 },
      { name: 'John', score: 45 },
      { name: 'Philip', score: 40 },
      { name: 'Sean', score: 35 }
    ];
    defaultEntries.forEach(entry => {
      if (leaderboard.length < 6 && !leaderboard.some(e => e.name === entry.name)) {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.name}.........${entry.score}`;
        leaderboardList.appendChild(listItem);
      }
    });
}

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
    submitBtn.onclick = submitName;
    leaderboardDiv.appendChild(submitBtn);

    startDiv.innerHTML = '';
    startDiv.appendChild(leaderboardDiv);
    startDiv.style.display = 'flex';

    nameInput.focus();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
// //Checklist Updating
let collectPointsChecked = false;
let defeatEnemiesChecked = false;
let reachLevelChecked = false;

const objectives = [
    { level: 1, tasks: ['Collect 10 points', 'Defeat 4 enemies', 'Reach level 5'] },
    { level: 5, tasks: ['Collect 50 points', 'Defeat 5 enemies', 'Reach level 10'] },
    { level: 10, tasks: ['Collect 100 points', 'Defeat 7 enemies', 'Reach level 15'] },
    { level: 15, tasks: ['Collect 150 points', 'Defeat 9 enemies', 'Reach level 20'] },
    // Add more objectives for higher levels
];

function updateChecklist() {
    const checklist = document.querySelector('.checklist ul');
    checklist.innerHTML = '';
  
    const currentObjectives = generateObjectives(Math.floor((level - 1) / 5) + 1);
  
    currentObjectives.forEach((task, index) => {
      const listItem = document.createElement('li');
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `task-${index}`;
      checkbox.addEventListener('click', function(event) {
        event.preventDefault();
      });
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + task));
      listItem.appendChild(label);
      checklist.appendChild(listItem);
    });
  
    checkCollectPoints();
    checkDefeatEnemies();
    checkReachLevel();
}

function checkCollectPoints() {
    const currentObjective = objectives.find(obj => obj.level <= level);
    if (currentObjective) {
      const collectPointsTask = currentObjective.tasks.find(task => task.startsWith('Collect'));
      if (collectPointsTask) {
        const targetPoints = parseInt(collectPointsTask.match(/\d+/)[0]);
        const checkbox = document.querySelector('.checklist ul li:first-child input[type="checkbox"]');
        if (score >= targetPoints) {
          checkbox.checked = true;
        } else {
          checkbox.checked = false;
        }
      }
    }
  }

function checkDefeatEnemies() {
const currentObjective = objectives.find(obj => obj.level <= level);
if (currentObjective) {
    const defeatEnemiesTask = currentObjective.tasks.find(task => task.startsWith('Defeat'));
    if (defeatEnemiesTask) {
    const targetEnemies = parseInt(defeatEnemiesTask.match(/\d+/)[0]);
    const checkbox = document.querySelector('.checklist ul li:nth-child(2) input[type="checkbox"]');
    const enemiesDefeated = (level - currentObjective.level) * 3; // Assuming 3 enemies per level
    if (enemiesDefeated >= targetEnemies) {
        checkbox.checked = true;
    } else {
        checkbox.checked = false;
    }
    }
}
}

function checkReachLevel() {
const currentObjective = objectives.find(obj => obj.level <= level);
if (currentObjective) {
    const reachLevelTask = currentObjective.tasks.find(task => task.startsWith('Reach'));
    if (reachLevelTask) {
    const targetLevel = parseInt(reachLevelTask.match(/\d+/)[0]);
    const checkbox = document.querySelector('.checklist ul li:last-child input[type="checkbox"]');
    if (level >= targetLevel) {
        checkbox.checked = true;
    } else {
        checkbox.checked = false;
    }
    }
}
}

function updateChecklistAfterLevels() {
if (level % 5 === 0) {
// Update the checklist every 5 levels
collectPointsChecked = false;
defeatEnemiesChecked = false;
reachLevelChecked = false;
document.getElementById('collect-points').checked = false;
document.getElementById('defeat-enemies').checked = false;
document.getElementById('reach-level').checked = false;
updateChecklist();
}
}

const objectiveTemplate = [
    level => `Collect ${level * 10} points`,
    level => `Defeat ${level * 2 + 1} enemies`,
    level => `Reach level ${level * 5}`
  ];
  
  function generateObjectives(level) {
    return objectiveTemplate.map(template => template(level));
  }
  
  function resetChecklist() {
    const checklist = document.querySelector('.checklist ul');
    checklist.innerHTML = '';
  
    const defaultObjectives = [
      'Collect 10 points',
      'Defeat 3 enemies',
      'Reach level 5'
    ];
  
    defaultObjectives.forEach((task, index) => {
      const listItem = document.createElement('li');
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `task-${index}`;
      checkbox.addEventListener('click', function(event) {
        event.preventDefault();
      });
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + task));
      listItem.appendChild(label);
      checklist.appendChild(listItem);
    });
  }

////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
// //Enemy movement

////////////////////////////////////////////////////////////////////////////////////////////////////////////


