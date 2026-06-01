export function dfs(grid, startNode, endNode) {
    const visitedNodesInOrder = [];
    const stack = [];
    
    stack.push(startNode);

    while (stack.length > 0) {
        const node = stack.pop();

        if (node.isWall) continue;
        if (node.isVisited) continue;

        node.isVisited = true;
        visitedNodesInOrder.push(node);

        if (node === endNode) return visitedNodesInOrder;

        const neighbors = getNeighbors(node, grid);
        // Push neighbors to stack
        for (const neighbor of neighbors) {
            if (!neighbor.isVisited && !neighbor.isWall) {
                // Only update previousNode if we are actually exploring it from here
                // to keep the final path trace accurate
                neighbor.previousNode = node; 
                stack.push(neighbor);
            }
        }
    }
    return visitedNodesInOrder;
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const {row, col} = node;
    const numRows = grid.length;
    const numCols = grid[0].length;

    // Pushed in reverse order so the stack pops them in the expected up/right/down/left order
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (row < numRows - 1) neighbors.push(grid[row + 1][col]);
    if (col < numCols - 1) neighbors.push(grid[row][col + 1]);
    if (row > 0) neighbors.push(grid[row - 1][col]);

    return neighbors;
}