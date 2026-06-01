export function bellmanFord(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const allNodes = getAllNodes(grid);

  for (let i = 0; i < allNodes.length - 1; i++) {
    let updated = false;
    for (const node of allNodes) {
      if (node.isWall || node.distance === Infinity) continue;
      const neighbors = getNeighbors(node, grid);
      for (const neighbor of neighbors) {
        if (!neighbor.isWall && neighbor.distance > node.distance + neighbor.weight) {
          neighbor.distance = node.distance + neighbor.weight;
          neighbor.previousNode = node;
          if (!neighbor.isVisited) {
            neighbor.isVisited = true;
            visitedNodesInOrder.push(neighbor);
          }
          updated = true;
        }
      }
    }
    if (!updated) break;
  }
  return visitedNodesInOrder;
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}