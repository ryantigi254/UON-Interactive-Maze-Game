// pathfinding.js

function findPath(startNode, endNode, grid) {
    const openSet = new Set();
    const closedSet = new Set();
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();
  
    openSet.add(startNode);
    gScore.set(startNode, 0);
    fScore.set(startNode, heuristic(startNode, endNode));
  
    while (openSet.size > 0) {
      const current = getLowestFScore(openSet, fScore);
      if (current === endNode) {
        return reconstructPath(cameFrom, current);
      }
  
      openSet.delete(current);
      closedSet.add(current);
  
      const neighbors = getNeighbors(current, grid);
      for (const neighbor of neighbors) {
        if (closedSet.has(neighbor)) {
          continue;
        }
  
        const tentativeGScore = gScore.get(current) + 1;
        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
        } else if (tentativeGScore >= gScore.get(neighbor)) {
          continue;
        }
  
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, tentativeGScore + heuristic(neighbor, endNode));
      }
    }
  
    return [];
  }
  
  function getLowestFScore(openSet, fScore) {
    let lowest = null;
    for (const node of openSet) {
      if (lowest === null || fScore.get(node) < fScore.get(lowest)) {
        lowest = node;
      }
    }
    return lowest;
  }
  
  function reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom.has(current)) {
      current = cameFrom.get(current);
      path.unshift(current);
    }
    return path;
  }
  
  function getNeighbors(node, grid) {
    const neighbors = [];
    const { x, y } = node;
    if (x > 0) neighbors.push(grid[y][x - 1]);
    if (x < grid[0].length - 1) neighbors.push(grid[y][x + 1]);
    if (y > 0) neighbors.push(grid[y - 1][x]);
    if (y < grid.length - 1) neighbors.push(grid[y + 1][x]);
    return neighbors.filter(neighbor => !neighbor.isWall);
  }
  
  function heuristic(node, endNode) {
    const dx = Math.abs(node.x - endNode.x);
    const dy = Math.abs(node.y - endNode.y);
    return dx + dy;
  }

  let maze = [
    [{ x: 0, y: 0, isWall: true }, { x: 1, y: 0, isWall: true }, ...],
    [{ x: 0, y: 1, isWall: true }, { x: 1, y: 1, isWall: false }, ...],
    ...
  ];

  