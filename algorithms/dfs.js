export function dfs(grid,startNode,endNode){
    const visitedNodesInOrder = [];
    dfsRecursive(startNode,endNode,grid,visitedNodesInOrder);
    return visitedNodesInOrder;
}

function dfsRecursive(node,endNode,grid,visitedNodesInOrder){
    if(!node||node.isWall || node.isVisited) return false;

    node.isVisited = true;
    visitedNodesInOrder.push(node);

    if(node===endNode) return true;

    const neighbors = getNeighbors(node,grid);
    for(const neighbor of neighbors){
        if(!neighbor.isVisited){
            neighbor.previousNode=node;
            if(dfsRecursive(neighbor,endNode,grid,visitedNodesInOrder)){
                return true;
            }
        }
    }
    return false;
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