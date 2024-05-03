// export function nextLevel() {
//   // Reset the necessary variables and containers
//   level = newLevel;
//   simplicity = newSimplicity;
//   score = 0;
//   maxScore = 0;
//   lives = 3;
//   updateLivesDisplay();

//   // Clear the maze and create a new one
//   main.innerHTML = '';
//   maze = generateMaze(level, simplicity);

//   // Reset player and enemy positions
//   const playerBlock = document.createElement('div');
//   playerBlock.id = 'player';
//   const playerMouth = document.createElement('div');
//   playerMouth.classList.add('mouth');
//   playerBlock.appendChild(playerMouth);
//   main.appendChild(playerBlock);

//   positionEnemies();

//   // Reset game state
//   playerCanMove = true;
//   startDiv.style.display = 'none';
//   gameOverDiv.style.display = 'none';
//   updateScoreDisplay();

//   // Handle level reset after level 5
//   if (newLevel > 5) {
//     newLevel = 1;
//     newSimplicity = 1;
//   } else {
//     newSimplicity -= 0.12;
//   }

//   console.log("Starting Level", level);

//   // Generate and append the new script element with the game code
//   const newScript = document.createElement('script');
//   newScript.type = 'module';
//   newScript.textContent = generateGameCode(newLevel, newSimplicity);
//   document.head.appendChild(newScript);

//   // Call activateGameCode() to activate the new game code
//   activateGameCode();

//   // Reload the page after adding the new script element
//   window.location.reload();
// }

// let newLevel = level + 1;
// let newSimplicity = simplicity - 0.12;