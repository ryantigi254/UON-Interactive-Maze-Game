

//     // Generate the maze using the Recursive Backtracker algorithm
//     function recursiveBacktracker(x, y) {
//       const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
//       const stack = [[x, y]];
  
//       while (stack.length > 0) {
//         const [cx, cy] = stack[stack.length - 1];
//         const neighbors = [];
  
//         for (let i = 0; i < 4; i++) {
//           const nx = cx + directions[i][0];
//           const ny = cy + directions[i][1];
  
//           if (nx >= 0 && nx < dimensions && ny >= 0 && ny < dimensions && maze[nx][ny] === 0) {
//             neighbors.push([nx, ny]);
//           }
//         }
  
//         if (neighbors.length > 0) {
//           const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
//           maze[nx][ny] = 0;
//           stack.push([nx, ny]);
//         } else {
//           stack.pop();
//         }
//       }
//     }
  
//     recursiveBacktracker(1, 1);
  
//     // Post-processing to remove obstacles next to walls
//     for (let y = 0; y < dimensions; y++) {
//       for (let x = 0; x < dimensions; x++) {
//         if (maze[y][x] === 1) {
//           for (let i = -1; i <= 1; i++) {
//             for (let j = -1; j <= 1; j++) {
//               const nx = x + i;
//               const ny = y + j;
  
//               if (nx >= 0 && nx < dimensions && ny >= 0 && ny < dimensions && maze[ny][nx] === 0) {
//                 maze[ny][nx] = 0;
//               }
//             }
//           }
//         }
//       }
//     }
  

  
