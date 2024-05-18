
// Initliazing the game
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let playerCanMove = false;
localStorage.removeItem('leaderboard');
let score = 0; 

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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let dimensions = 10;
document.documentElement.style.setProperty('--dimensions', dimensions);

function generateMaze(level, simplicity) {
    const dimensions = Math.min(10 + Math.floor(level / 2), 13);
    document.documentElement.style.setProperty('--dimensions', dimensions);

    let maze;
    if (level <= 5) {
        // Uses the existing maze generation algorithm for levels 1-5
        do {
            maze = generateMazeInternal(dimensions, level, simplicity);
        } while (!isSolvable(maze));
    } else {
        // Uses the new maze generation algorithm for levels 6 and above
        maze = generateNewMaze(dimensions, level);
    }

    console.log(`Level ${level} maze:`);
    console.log(maze);

    return maze;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Maze Generation Logic Level 1-5
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

    // Randomly place points
    const placePoints = Math.floor((dimensions - 2) * (dimensions - 2) * (1 - wallProbability));
    for (let i = 0; i < placePoints; i++) {
        let pointY, pointX;
        do {
            pointY = Math.floor(Math.random() * (dimensions - 2)) + 1;
            pointX = Math.floor(Math.random() * (dimensions - 2)) + 1;
        } while (
            maze[pointY][pointX] !== 0 ||
            (maze[pointY - 1][pointX] === 1 && maze[pointY + 1][pointX] === 1) ||
            (maze[pointY][pointX - 1] === 1 && maze[pointY][pointX + 1] === 1)
        );
        maze[pointY][pointX] = 0;
    }
    
    return maze;
}
function isSolvable(maze) {
    for (let y = 1; y < dimensions - 1; y++) {
        for (let x = 1; x < dimensions - 1; x++) {
            if (maze[y][x] == 0 || maze[y][x] == 3) {
                if (
                    maze[y - 1][x] === 1 &&
                    maze[y + 1][x] === 1 &&
                    maze[y][x - 1] === 1 &&
                    maze[y][x + 1] === 1
                ) {
                    console.log(`Unsolvable maze detected at (${y}, ${x})`);
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
                    console.log(`Inaccessible point or enemy detected at (${y}, ${x})`);
                    return false;
                }

                // Check if the point is inside an obstacle block
                if (
                    maze[y - 1][x - 1] === 1 &&
                    maze[y - 1][x] === 1 &&
                    maze[y - 1][x + 1] === 1 &&
                    maze[y][x - 1] === 1 &&
                    maze[y][x + 1] === 1 &&
                    maze[y + 1][x - 1] === 1 &&
                    maze[y + 1][x] === 1 &&
                    maze[y + 1][x + 1] === 1
                ) {
                    console.log(`Point inside an obstacle block detected at (${y}, ${x})`);
                    return false;
                }
            }
        }
    }
    return true;
}

function isPointAccessible(maze, y, x) {
    const visited = new Set();
    const queue = [[y, x]];
    visited.add(`${y},${x}`);

    while (queue.length > 0) {
        const [currentY, currentX] = queue.shift();

        // Check if the current position is on the edge of the maze (accessible)
        if (currentY === 0 || currentX === 0 || currentY === maze.length - 1 || currentX === maze[0].length - 1) {
            return true;
        }

        // Check adjacent positions
        const neighbors = [
            [currentY - 1, currentX],
            [currentY + 1, currentX],
            [currentY, currentX - 1],
            [currentY, currentX + 1],
        ];

        for (const [neighborY, neighborX] of neighbors) {
            if (
                neighborY >= 0 &&
                neighborY < maze.length &&
                neighborX >= 0 &&
                neighborX < maze[0].length &&
                maze[neighborY][neighborX] === 0 &&
                !visited.has(`${neighborY},${neighborX}`)
            ) {
                visited.add(`${neighborY},${neighborX}`);
                queue.push([neighborY, neighborX]);
            }
        }
    }

    return false; // The point is enclosed and inaccessible
}

function ensurePointsAccessible(maze) {
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 0 && !isPointAccessible(maze, y, x)) {
                console.log(`Inaccessible point detected at (${y}, ${x})`);

                return generateMaze(level, simplicity);
            }
        }
    }
    return maze;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Maze Generation Logic level 6-∞
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function recursiveBacktracking(maze, x, y) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const stack = [[x, y]];

    while (stack.length > 0) {
        const [x, y] = stack[stack.length - 1];
        maze[y][x] = 0; // Mark as visited

        const neighbors = [];
        for (let i = 0; i < 4; i++) {
            const dx = directions[i][0];
            const dy = directions[i][1];
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < maze[0].length && ny >= 0 && ny < maze.length && maze[ny][nx] === 1) {
                neighbors.push([nx, ny]);
            }
        }

        if (neighbors.length > 0) {
            const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
            maze[ny][nx] = 0; // Mark as visited
            stack.push([nx, ny]);
        } else {
            stack.pop();
        }
    }
}

function prim(maze) {
    const width = maze[0].length;
    const height = maze.length;
    const tree = Array(width).fill().map(() => Array(height).fill(false));

    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * height);
    tree[y][x] = true;

    const queue = [[x, y]];

    while (queue.length > 0) {
        const [x, y] = queue.shift();
        maze[y][x] = 0; 

        const neighbors = [];
        for (let i = 0; i < 4; i++) {
            const dx = [-1, 1, 0, 0][i];
            const dy = [0, 0, -1, 1][i];
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < width && ny >= 0 && ny < height && !tree[ny][nx]) {
                neighbors.push([nx, ny]);
            }
        }

        if (neighbors.length > 0) {
            const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
            tree[ny][nx] = true;
            queue.push([nx, ny]);
        }
    }
}

function dfs(maze, x, y) {
    const stack = [[x, y]];
    const visited = Array(maze.length).fill().map(() => Array(maze[0].length).fill(false));

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        if (visited[y][x]) continue;
        visited[y][x] = true;

        if (maze[y][x] === 0) {
            // Mark as reachable
        } else {
            // Mark as unreachable
        }

        const neighbors = [];
        for (let i = 0; i < 4; i++) {
            const dx = [-1, 1, 0, 0][i];
            const dy = [0, 0, -1, 1][i];
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < maze[0].length && ny >= 0 && ny < maze.length && !visited[ny][nx]) {
                neighbors.push([nx, ny]);
            }
        }

        for (const neighbor of neighbors) {
            stack.push(neighbor);
        }
    }
}

function placeEnemies(maze, level) {
    const numEnemies = Math.min(3 + Math.floor(level / 5), 5);
    for (let i = 0; i < numEnemies; i++) {
      let enemyX, enemyY;
      do {
        enemyX = Math.floor(Math.random() * maze[0].length);
        enemyY = Math.floor(Math.random() * maze.length);
      } while (maze[enemyY][enemyX] !== 0 && maze[enemyY][enemyX] !== 1);
      maze[enemyY][enemyX] = 3;
    }
  }

  function placePoints(maze, level) {
    const numPoints = Math.floor((maze[0].length - 2) * (maze.length - 2) * (0.5 + level * 0.05));
    for (let i = 0; i < numPoints; i++) {
      let pointX, pointY;
      do {
        pointX = Math.floor(Math.random() * maze[0].length);
        pointY = Math.floor(Math.random() * maze.length);
      } while (maze[pointY][pointX] !== 0 && maze[pointY][pointX] !== 1);
      maze[pointY][pointX] = 0;
    }
  }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateNewMaze(dimensions, level) {
    let maze = Array(dimensions).fill().map(() => Array(dimensions).fill(1));
    recursiveBacktracking(maze, 1, 1);
    prim(maze);

    // Place the player
    let playerX, playerY;
    do {
        playerX = Math.floor(Math.random() * dimensions);
        playerY = Math.floor(Math.random() * dimensions);
    } while (maze[playerY][playerX] !== 0);
    maze[playerY][playerX] = 2;

    // Place enemies
    const numEnemies = Math.min(3 + Math.floor(level / 5), 5);
    for (let i = 0; i < numEnemies; i++) {
        let enemyX, enemyY;
        do {
            enemyX = Math.floor(Math.random() * dimensions);
            enemyY = Math.floor(Math.random() * dimensions);
        } while (maze[enemyY][enemyX] !== 0);
        maze[enemyY][enemyX] = 3;
    }

    // Place points
    const numPoints = Math.floor((dimensions - 2) * (dimensions - 2) * (0.5 + level * 0.05));
    for (let i = 0; i < numPoints; i++) {
        let pointX, pointY;
        do {
            pointX = Math.floor(Math.random() * dimensions);
            pointY = Math.floor(Math.random() * dimensions);
        } while (maze[pointY][pointX] !== 0);
        maze[pointY][pointX] = 0;
    }

    return maze;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Maze population.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let level = 1;
let simplicity = 1;
maze = ensurePointsAccessible(generateMaze(level, simplicity));

function MazePopulator() {
    const level = Math.floor((score - 1) / 100) + 1;
    const simplicity = 1 - level * 0.05;

    if (level <= 5) {
        maze = generateMaze(level, simplicity);
    } else {
        maze = generateNewMaze(dimensions, level);
    }

    main.innerHTML = ''; // Clear previous maze elements

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
    setColorOptions();
}

MazePopulator();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
// Function to create a new enemy element and color assignment
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getEnemyColor(y, x) {
    // Assign colors based on enemy position
    if (y === 1 && x === 8) {
        return 'purple'; // Enemy 1
    } else if (y === 3 && x === 1) {
        return 'darkblue'; // Enemy 2
    } else if (y === 6 && x === 5) {
        return 'darkblue'; // Enemy 3
    } else if (y === 8 && x === 1) {
        return 'magenta'; // Enemy 4 
    }
}


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
    const randomIndex = Math.floor(Math.random() * colorOptions.length);
    const selectedOption = colorOptions[randomIndex];

    playerColor = selectedOption.getAttribute('data-player-color');
    const enemy1Color = selectedOption.getAttribute('data-enemy1-color');
    const enemy2Color = selectedOption.getAttribute('data-enemy2-color');
    const enemy3Color = selectedOption.getAttribute('data-enemy3-color');

    player = document.querySelector('#player');
 

    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach((enemy, index) => {
        if (index === 0) {
            updateEnemyColor(enemy, enemy1Color);
        } else if (index === 1) {
            updateEnemyColor(enemy, enemy2Color);
        } else if (index >= 2) {
            updateEnemyColor(enemy, enemy3Color);
        }
    });

    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            const playerColor = option.getAttribute('data-player-color');
            const enemy1Color = option.getAttribute('data-enemy1-color');
            const enemy2Color = option.getAttribute('data-enemy2-color');
            const enemy3Color = option.getAttribute('data-enemy3-color');

            player.style.backgroundColor = playerColor;

            enemies.forEach((enemy, index) => {
                if (index === 0) {
                    updateEnemyColor(enemy, enemy1Color);
                } else if (index === 1) {
                    updateEnemyColor(enemy, enemy2Color);
                } else if (index >= 2) {
                    updateEnemyColor(enemy, enemy3Color);
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
        event.preventDefault(); 
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

// Start game function
function startGame() {
    startDiv.style.display = 'none';
    playerCanMove = true;
    lives = 3; 
    updateLivesDisplay();
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
    // updateChecklist(); // Call the updateChecklist function
    // updateChecklistAfterLevels(); 
    let player = document.querySelector('#player');

    if (playerCanMove) {
        let position = player.getBoundingClientRect();
        let nextTop = position.top - (upPressed ? movement: 0) 
        let nextBottom = position.bottom + (downPressed ? movement : 0) 
        let nextLeft = position.left - (leftPressed ? movement : 0) 
        let nextRight = position.right + (rightPressed ? movement : 0) 
       
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
    checkAllObjectives(); 
    if (maxScore === 0){
        maxScore++;
        levelComplete();
    }
    updatePlayerMouth();
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

// Grid-based collision detection system
const gridSize = 10;
const grid_00 = [];

for (let y = 0; y < maze.length; y++) {
    grid_00[y] = [];
    for (let x = 0; x < maze[y].length; x++) {
        grid_00[y][x] = maze[y][x] === 1 ? 'wall' : 'empty';
    }
}

// Function to check for collisions
function checkCollision(x, y) {
    if (x < 0 || x >= maze[0].length || y < 0 || y >= maze.length) {
        return true; 
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
    gameOverDiv.innerHTML += '<br>' + 'Game Over' + '<br>';

    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Restart';
    restartBtn.classList.add('restart-btn');
    restartBtn.onclick = restartGame;
    gameOverDiv.appendChild(restartBtn);

    startDiv.innerHTML = '';
    startDiv.appendChild(gameOverDiv);
    startDiv.style.display = 'flex';
}

let hasEnteredName = false;
let hasClickedEnterName = false;

function showEnterNameScreen() {
    hasClickedEnterName = true; 
    startDiv.classList.remove('startDiv');
    startDiv.classList.add('enter-name');
    startDiv.innerHTML = `
        <h2>Enter Your Name</h2>
        <div class="input-container">
            <input type="text" id="nameInput" placeholder="Your Name">
            <button class="restart-btn" onclick="submitName()">Submit</button>
        </div>
    `;

    const nameInput = document.getElementById('nameInput');
    nameInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            submitName();
        }
    });
}

function submitName() {
    const nameInput = document.getElementById('nameInput');
    playerName = nameInput.value.trim();
    if (playerName) {
        if (leaderboard.entries.length >= leaderboard.maxEntries) {
            leaderboard.entries.pop();
        leaderboard.addEntry(playerName, score);
        leaderboard.updateLeaderboardHTML();
        hasEnteredName = true; 
        nextLevel();
    }
}
}

function showNextLevelScreen() {
    startDiv.classList.remove('startDiv');
    startDiv.classList.add('level-complete');
    startDiv.innerHTML = `
        <h2>Level Complete</h2>
        <div class="button-container">
            ${!hasEnteredName ? '<button class="restart-btn" onclick="showEnterNameScreen()">Enter Your Name</button>' : ''}
            <button class="restart-btn" onclick="nextLevel()">Next Level</button>
        </div>
    `;
    startDiv.style.display = 'flex';
}

let playerName = '';

function nextLevel() {
    level++;
    simplicity -= 0.12;
    startDiv.style.display = 'none';
    console.log(`Current Level: ${level}`);
    console.log("Current simplicity: " + simplicity);
    dimensions = Math.min(10 + Math.floor(level / 2), 17);

    document.documentElement.style.setProperty('--dimensions', dimensions);
    maze = generateMaze(level, simplicity);
    MazePopulator();

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

    // Update the leaderboard
    const playerEntry = leaderboard.entries.find(entry => entry.name === playerName);
    if (playerEntry) {
        playerEntry.score = score;
        leaderboard.entries.sort((a, b) => b.score - a.score);
        leaderboard.updateLeaderboardHTML();
    }

    setColorOptions();
    positionEnemies();
    startEnemyMovement();
    RandomMovementTimer();
    updateChecklist(); 
    updatePlayerMouth();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////

updateLivesDisplay();

////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
// //Update the lives via Javascript
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateLivesDisplay() {
    const livesContainer = document.querySelector('.lives ul');
    livesContainer.innerHTML = ''; 

    for (let i = 0; i < lives; i++) {
        const lifeElement = document.createElement('li');
        livesContainer.appendChild(lifeElement);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

 
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
// //Score Functionality
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let maxScore = document.querySelectorAll('.point').length-40


//update the score display 
function checkScoreCollisions() {
    const playerRect = player.getBoundingClientRect();
    const points = document.querySelectorAll('.point');
    for (let point of points) {
        const pointRect = point.getBoundingClientRect();
        if (playerRect.left < pointRect.right && playerRect.right > pointRect.left &&
            playerRect.top < pointRect.bottom && playerRect.bottom > pointRect.top) {
            point.classList.remove('point');
            score += 1;
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
class LeaderboardEntry {
    constructor(name, score) {
      this.name = name;
      this.score = score;
    }
  }
  
  class Leaderboard {
    constructor() {
        this.entries = [];
        this.maxEntries = 6;
    }

    addEntry(name, score) {
        const entry = new LeaderboardEntry(name, score);
        this.entries.push(entry);
        this.entries.sort((a, b) => b.score - a.score); 
        if (this.entries.length > this.maxEntries) {
            this.entries.pop(); 
        }
        this.updateLeaderboardHTML();
    }

    getTopEntries(count) {
        return this.entries.slice(0, count);
    }

    updateLeaderboardHTML() {
        const leaderboardHTML = document.querySelector('.leaderboard ol');
        leaderboardHTML.innerHTML = '';
        this.entries.forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.name}..........${entry.score}`;
            leaderboardHTML.appendChild(listItem);
        });
    }
}
  
  const leaderboard = new Leaderboard();
  

  

  
  // Initialize the leaderboard with the default entries
  leaderboard.addEntry('Chris', 150);
  leaderboard.addEntry('Mark', 75);
  leaderboard.addEntry('Tom', 50);
  leaderboard.addEntry('John', 45);
  leaderboard.addEntry('Philip', 40);
  leaderboard.addEntry('Sean', 35);
  leaderboard.updateLeaderboardHTML();
////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
// Initial setup for objectives
let collectPointsChecked = false;
let defeatEnemiesChecked = false;
let reachLevelChecked = false;

function generateDynamicObjectives(level) {
    let pointsToCollect = level * 10;
    let enemiesToDefeat = Math.ceil(level / 2) + 2;
    let targetLevel = level + 4;

    return [
        `Collect ${pointsToCollect} points`,
        `Defeat ${enemiesToDefeat} enemies`,
        `Reach level ${targetLevel}`
    ];
}

function updateChecklist() {
    const checklist = document.querySelector('.checklist ul');
    checklist.innerHTML = '';

    const currentObjectives = generateDynamicObjectives(level);
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
}

function checkCollectPoints() {
    const targetPoints = level * 10;
    const checkbox = document.querySelector('.checklist ul li:first-child input[type="checkbox"]');
    if (score >= targetPoints) {
        checkbox.checked = true;
        collectPointsChecked = true;
    } else {
        checkbox.checked = false;
        collectPointsChecked = false;
    }
}

function checkDefeatEnemies() {
    const targetEnemies = Math.ceil(level / 2) + 2;
    const checkbox = document.querySelector('.checklist ul li:nth-child(2) input[type="checkbox"]');
    const enemiesDefeated = (level - 1) * 3; 
    if (enemiesDefeated >= targetEnemies) {
        checkbox.checked = true;
        defeatEnemiesChecked = true;
    } else {
        checkbox.checked = false;
        defeatEnemiesChecked = false;
    }
}

function checkReachLevel() {
    const targetLevel = level + 4;
    const checkbox = document.querySelector('.checklist ul li:last-child input[type="checkbox"]');
    if (level >= targetLevel) {
        checkbox.checked = true;
        reachLevelChecked = true;
    } else {
        checkbox.checked = false;
        reachLevelChecked = false;
    }
}

function checkAllObjectives() {
    checkCollectPoints();
    checkDefeatEnemies();
    checkReachLevel();

    if (collectPointsChecked && defeatEnemiesChecked && reachLevelChecked) {
        levelComplete();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    updateChecklist();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************************************************************************************
// //Enemy movement

function startEnemyMovement(){
enemies.forEach(enemy => {
    enemy.classList.add("MoveBottom")
})
}

function RandomMovementTimer() { 
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        enemy.classList.remove("MoveLeft");
        enemy.classList.remove("MoveTop");
        enemy.classList.remove("MoveRight");
        enemy.classList.remove("MoveBottom");

        const randomNum = Math.floor(Math.random() * 4) + 1;


        switch (randomNum) {
            case 1:

                enemy.classList.add("MoveLeft")

            case 2:

                enemy.classList.add("MoveTop");

            case 3:

                enemy.classList.add("MoveRight")

            case 4:

                enemy.classList.add("MoveBottom")

        }
    })
}


let difficultyprompt = 5
let difficulty = 6;


function enemyMovement() {
    if (playerCanMove == false)
        return;
    // console.log("hello")
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        let enemyposition = enemy.getBoundingClientRect()

        let next = 5;
        let nextTOP = enemyposition.top - next
        let nextLEFT = enemyposition.left - next
        let nextBOTTOM = enemyposition.top + enemyposition.height + next
        let nextRIGHT = enemyposition.left + enemyposition.width + next

        let x = enemyposition.left
        let y = enemyposition.top


        let movementX = parseInt(enemy.style.left, 10)
        let movementY = parseInt(enemy.style.top, 10)

        if (isNaN(movementX)) {
            movementX = 0
        }
        if (isNaN(movementY)) {
            movementY = 0
        }

        // this will make sure that both top right and top left are checked for wall to ensure fair collision and similar with all 4 directions
        let coordinateTopRight = document.elementFromPoint(x + (enemyposition.width), nextTOP)
        let coordinateTopLeft = document.elementFromPoint(x, nextTOP)

        let coordinateLeftUp = document.elementFromPoint(nextLEFT, y + (enemyposition.height))
        let coordinateLeftDown = document.elementFromPoint(nextLEFT, y)

        let coordinateBottomRight = document.elementFromPoint(x + (enemyposition.width), nextBOTTOM)
        let coordinateBottomLeft = document.elementFromPoint(x, nextBOTTOM)

        let coordinateRightUp = document.elementFromPoint(nextRIGHT, y + (enemyposition.height))
        let coordinateRightDown = document.elementFromPoint(nextRIGHT, y)


        function reset() {
            if (!coordinateLeftUp.classList.contains("wall") && !coordinateLeftDown.classList.contains("wall")) {
                enemy.classList.add("MoveLeft")
                movementX -= difficulty;
                enemy.style.left = movementX + "px"

            } else if (!coordinateTopRight.classList.contains("wall") && !coordinateTopLeft.classList.contains("wall")) {
                enemy.classList.add("MoveTop");
                movementY -= difficulty;
                enemy.style.top = movementY + "px";

            } else if (!coordinateRightUp.classList.contains("wall") && !coordinateRightDown.classList.contains("wall")) {
                enemy.classList.add("MoveRight")
                movementX += difficulty;
                enemy.style.left = movementX + "px"
            } else {
                enemy.classList.add("MoveBottom")
                movementY += difficulty;
                enemy.style.top = movementY + "px"
            }
        }


        function RandomMovement() {

            const randomNumber = Math.floor(Math.random() * 4) + 1;
            switch (randomNumber) {
                case 1:
                    if (!coordinateLeftUp.classList.contains("wall") && !coordinateLeftDown.classList.contains("wall")) {
                        enemy.classList.add("MoveLeft")
                        movementX -= difficulty;
                        enemy.style.left = movementX + "px"
                    } else {
                        reset()
                    }
                    ;
                case 2:
                    // for case 2 enemy moves Top
                    if (!coordinateTopRight.classList.contains("wall") && !coordinateTopLeft.classList.contains("wall")) {
                        enemy.classList.add("MoveTop");
                        movementY -= difficulty;
                        enemy.style.top = movementY + "px";
                    } else {
                        reset()
                    }
                case 3:
                    // for case 3 enemy moves Right
                    if (!coordinateRightUp.classList.contains("wall") && !coordinateRightDown.classList.contains("wall")) {
                        enemy.classList.add("MoveRight")
                        movementX += difficulty;
                        enemy.style.left = movementX + "px"
                    } else {
                        reset()
                    }
                case 4:
                    // for case 4 enemy moves Bottom
                    if (!coordinateBottomRight.classList.contains("wall") && !coordinateBottomLeft.classList.contains("wall")) {
                        enemy.classList.add("MoveBottom")
                        movementY += difficulty;
                        enemy.style.top = movementY + "px"
                    } else {
                        reset()
                    }
                    break;
            }
        }





        if (enemy.classList.contains("MoveLeft")) {
            if (!coordinateLeftUp.classList.contains("wall") && !coordinateLeftDown.classList.contains("wall")) {
                movementX -= difficulty
                enemy.style.left = movementX + "px"
            } else {
                enemy.classList.remove("MoveLeft");
                RandomMovement()
            }
        }

        else if (enemy.classList.contains("MoveTop")) {
            if (!coordinateTopRight.classList.contains("wall") && !coordinateTopLeft.classList.contains("wall")) {
                movementY -= difficulty
                enemy.style.top = movementY + "px"
            } else {
                enemy.classList.remove("MoveTop")
                RandomMovement()
            }
        }

        else if (enemy.classList.contains("MoveRight")) {
            if (!coordinateRightUp.classList.contains("wall") && !coordinateRightDown.classList.contains("wall")) {
                movementX += difficulty
                enemy.style.left = movementX + "px"
            } else {
                enemy.classList.remove("MoveRight")
                RandomMovement()
            }


        } else if (enemy.classList.contains("MoveBottom")) {
            if (!coordinateBottomRight.classList.contains("wall") && !coordinateBottomLeft.classList.contains("wall")) {
                movementY += difficulty;
                enemy.style.top = movementY + "px"
            } else {
                enemy.classList.remove("MoveBottom")
                RandomMovement()
            }
        }
    });
}

enemyMovementInterval = setInterval(enemyMovement, 1)
enemyRandomTimerInterval = setInterval(RandomMovementTimer, 5000)

startEnemyMovement();
////////////////////////////////////////////////////////////////////////////////////////////////////////////

