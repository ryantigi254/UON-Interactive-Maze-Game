let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

const main = document.querySelector('main');

//Player = 2, Wall = 1, Enemy = 3, Point = 0
let maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

//Populates the maze in the HTML
for (let y of maze) {
    for (let x of y) {
        let block = document.createElement('div');
        block.classList.add('block');

        switch (x) {
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
                block.classList.add('enemy');
                break;
            default:
                block.classList.add('point');
                block.style.height = '1vh';
                block.style.width = '1vh';
        }

        main.appendChild(block);
    }
}

//Player movement
function keyUp(event) {
    if (event.key === 'ArrowUp') {
        upPressed = false;
    } else if (event.key === 'ArrowDown') {
        downPressed = false;
    } else if (event.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightPressed = false;
    }
}

function keyDown(event) {
    if (event.key === 'ArrowUp') {
        upPressed = true;
    } else if (event.key === 'ArrowDown') {
        downPressed = true;
    } else if (event.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightPressed = true;
    }
}

const player = document.querySelector('#player');
const playerMouth = player.querySelector('.mouth');
let playerTop = 0;
let playerLeft = 0;



document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);


// Reference to the start button and the start div
const startBtn = document.querySelector('.start');
const startDiv = document.querySelector('.startDiv');

// Function to initiate the game
function startGame() {
  // Hide the start button
  startDiv.style.display = 'none';
  // Allow player movement
  playerCanMove = true;
}

// Attach the click event to the start button
startBtn.addEventListener('click', startGame);

// Initialize the playerCanMove to false
let playerCanMove = false;


let playerRow = 1;
let playerCol = 1;

document.getElementById('lbttn').addEventListener('click', () => {leftPressed = true; setTimeout(() => leftPressed = false, 100);});
document.getElementById('ubttn').addEventListener('click', () => {upPressed = true; setTimeout(() => upPressed = false, 100);});
document.getElementById('rbttn').addEventListener('click', () => {rightPressed = true; setTimeout(() => rightPressed = false, 100);});
document.getElementById('dbttn').addEventListener('click', () => {downPressed = true; setTimeout(() => downPressed = false, 100);});

setInterval(function() {
    let moved = false;
    if (downPressed) {
        playerTop += 10;
        moved = true;
    }
    if (upPressed) {
        playerTop -= 10;
        moved = true;
    }
    if (leftPressed) {
        playerLeft -= 10;
        moved = true;
    }
    if (rightPressed) {
        playerLeft += 10;
        moved = true;
    }

    player.style.top = playerTop + 'px';
    player.style.left = playerLeft + 'px';

    if (moved) {
        playerMouth.classList.add('open');
    } else {
        playerMouth.classList.remove('open');
    }
}, 100);

function updatePlayerPosition() {
    // Clear the current player position
    maze.forEach((row, rIndex) => {
        row.forEach((col, cIndex) => {
            if (maze[rIndex][cIndex] === 2) {
                maze[rIndex][cIndex] = 0;
            }
        });
    })
    ;

    // Update the maze with the new player position
    maze[playerRow][playerCol] = 2;

    // Re-generate the HTML for the maze
    main.innerHTML = '';
    for (let y of maze) {
        for (let x of y) {
            let block = document.createElement('div');
            block.classList.add('block');

            switch (x) {
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
                    block.classList.add('enemy');
                    break;
                default:
                    block.classList.add('point');
                    block.style.height = '1vh';
                    block.style.width = '1vh';
            }

            main.appendChild(block);
        }
    }
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      if (playerRow > 0 && maze[playerRow - 1][playerCol] !== 1) {
        maze[playerRow][playerCol] = 0;
        playerRow--;
        maze[playerRow][playerCol] = 2;
      }
      break;
    case 'ArrowDown':
      if (playerRow < maze.length - 1 && maze[playerRow + 1][playerCol] !== 1) {
        maze[playerRow][playerCol] = 0;
        playerRow++;
        maze[playerRow][playerCol] = 2;
      }
      break;
    case 'ArrowLeft':
      if (playerCol > 0 && maze[playerRow][playerCol - 1] !== 1) {
        maze[playerRow][playerCol] = 0;
        playerCol--;
        maze[playerRow][playerCol] = 2;
      }
      break;
    case 'ArrowRight':
      if (playerCol < maze[0].length - 1 && maze[playerRow][playerCol + 1] !== 1) {
        maze[playerRow][playerCol] = 0;
        playerCol++;
        maze[playerRow][playerCol] = 2;
      }
      break;
  }
  updatePlayerPosition();
});



