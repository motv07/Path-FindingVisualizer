export function bfs(grid, startNode, endNode) {
  const visitedNodes = [];
  const queue = [];
  queue.push(startNode);
  startNode.isVisited = true;

  while (queue.length > 0) {
    const currentNode = queue.shift();
    visitedNodes.push(currentNode);

    if (currentNode === endNode) return visitedNodes;

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        queue.push(neighbor);
      }
    }
  }

  return visitedNodes;
}


function getNeighbors(node,grid){
    const neighbors = [];
    const {row,col} = node;
    const numRows = grid.length;
    const numCols = grid[0].length;

    if(row>0) neighbors.push(grid[row-1][col]);
    if(col<numCols-1) neighbors.push(grid[row][col+1]);
    if(row<numRows-1) neighbors.push(grid[row+1][col]);
    if(col>0) neighbors.push(grid[row][col-1]);

    return neighbors;
}