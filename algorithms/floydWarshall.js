export function floydWarshall(grid, startNode, endNode) {
  const nodes = getAllNodes(grid);
  const V = nodes.length;
  const dist = Array.from({ length: V }, () => Array(V).fill(Infinity));
  const next = Array.from({ length: V }, () => Array(V).fill(null));
  
  const nodeToIndex = new Map();
  const indexToNode = new Array(V);

  let idx = 0;
  for (const node of nodes) {
    nodeToIndex.set(node, idx);
    indexToNode[idx] = node;
    dist[idx][idx] = 0;
    idx++;
  }

  for (const node of nodes) {
    if (node.isWall) continue;
    const u = nodeToIndex.get(node);
    const neighbors = getNeighbors(node, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isWall) continue;
      const v = nodeToIndex.get(neighbor);
      dist[u][v] = neighbor.weight;
      next[u][v] = neighbor;
    }
  }

  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity && dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }

  const visitedNodesInOrder = [];
  const u = nodeToIndex.get(startNode);
  const v = nodeToIndex.get(endNode);

  if (next[u][v] === null) return visitedNodesInOrder;

  let curr = startNode;
  while (curr !== endNode) {
    visitedNodesInOrder.push(curr);
    curr.isVisited = true;
    const currIdx = nodeToIndex.get(curr);
    const nextNode = next[currIdx][v];
    nextNode.previousNode = curr;
    curr = nextNode;
  }
  
  visitedNodesInOrder.push(endNode);
  endNode.isVisited = true;

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