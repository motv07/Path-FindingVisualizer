import { bfs } from "./algorithms/bfs.js";
import { dijkstra } from "./algorithms/dijkstra.js";
import { dfs } from "./algorithms/dfs.js";

const gridContainer = document.getElementById('grid');
let rows = 20;
let cols = 50;
let START_ROW = 10;
let START_COL = 5;
let END_ROW = 10;
let END_COL = 44;

let isDraggingStart = false;
let isDraggingEnd = false;

let grid = [];

function createGrid() {
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 20px)`;
  gridContainer.innerHTML = '';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (row === START_ROW && col === START_COL) {
        cell.classList.add('start');
      } else if (row === END_ROW && col === END_COL) {
        cell.classList.add('end');
      }

      cell.addEventListener('mousedown', () => {
        if (cell.classList.contains('start')) {
          isDraggingStart = true;
        } else if (cell.classList.contains('end')) {
          isDraggingEnd = true;
        } else {
          toggleWall(cell);
        }
      });

      cell.addEventListener('mouseenter', () => {
        if (isDraggingStart) {
          moveStartTo(cell);
        } else if (isDraggingEnd) {
          moveEndTo(cell);
        }
      });

      cell.addEventListener('mouseup', () => {
        isDraggingStart = false;
        isDraggingEnd = false;
      });

      gridContainer.appendChild(cell);
    }
  }
}

function toggleWall(cell) {
  if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
    cell.classList.toggle('wall');
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    grid[row][col].isWall = cell.classList.contains('wall');
  }
}

function moveStartTo(cell) {
  const oldStart = document.querySelector('.start');
  if (oldStart) oldStart.classList.remove('start');

  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  cell.classList.remove('wall');
  cell.classList.add('start');

  START_ROW = row;
  START_COL = col;
  initializeGridData();
}

function moveEndTo(cell) {
  const oldEnd = document.querySelector('.end');
  if (oldEnd) oldEnd.classList.remove('end');

  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  cell.classList.remove('wall');
  cell.classList.add('end');

  END_ROW = row;
  END_COL = col;
  initializeGridData();
}

function initializeGridData() {
  grid = [];
  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      const cell = {
        row,
        col,
        isStart: row === START_ROW && col === START_COL,
        isEnd: row === END_ROW && col === END_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
      };
      currentRow.push(cell);
    }
    grid.push(currentRow);
  }
}

function visualizeDijkstra() {
  const startNode = grid[START_ROW][START_COL];
  const endNode = grid[END_ROW][END_COL];
  const visitedNodes = dijkstra(grid, startNode, endNode);
  animateVisitedNodes(visitedNodes);
}

function visualizeBFS() {
  const startNode = grid[START_ROW][START_COL];
  const endNode = grid[END_ROW][END_COL];
  const visitedNodes = bfs(grid, startNode, endNode);
  animateVisitedNodes(visitedNodes);
}

function visualizeDFS() {
  const startNode = grid[START_ROW][START_COL];
  const endNode = grid[END_ROW][END_COL];
  const visitedNodes = dfs(grid, startNode, endNode);
  animateVisitedNodes(visitedNodes);
}

function animateVisitedNodes(visitedNodes) {
  for (let i = 0; i <= visitedNodes.length; i++) {
    if (i === visitedNodes.length) {
      setTimeout(() => {
        animateShortestPath(grid[END_ROW][END_COL]);
      }, 10 * i);
      return;
    }
    setTimeout(() => {
      const node = visitedNodes[i];
      const cell = document.querySelector(
        `[data-row="${node.row}"][data-col="${node.col}"]`
      );
      if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
        cell.style.backgroundColor = 'lightblue';
      }
    }, 10 * i);
  }
}

function animateShortestPath(endNode) {
  const nodesInPath = [];
  let current = endNode;
  while (current !== null) {
    nodesInPath.unshift(current);
    current = current.previousNode;
  }

  for (let i = 0; i < nodesInPath.length; i++) {
    setTimeout(() => {
      const node = nodesInPath[i];
      const cell = document.querySelector(
        `[data-row="${node.row}"][data-col="${node.col}"]`
      );
      if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
        cell.style.backgroundColor = 'yellow';
      }
    }, 30 * i);
  }
}

function clearPath() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      const node = grid[row][col];

      if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
        if (!cell.classList.contains('wall')) {
          cell.style.backgroundColor = '';
        }
      }

      node.distance = Infinity;
      node.isVisited = false;
      node.previousNode = null;
    }
  }
}

function clearWalls() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      const node = grid[row][col];

      if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
        if (!cell.classList.contains('wall')) {
          cell.style.backgroundColor = '';
        }
      }

      if (cell.classList.contains('wall')) {
        cell.classList.remove('wall');
        node.isWall = false;
      }

      node.distance = Infinity;
      node.isVisited = false;
      node.previousNode = null;
    }
  }
}

function generateRandomMaze() {
  clearWalls();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isStart = row === START_ROW && col === START_COL;
      const isEnd = row === END_ROW && col === END_COL;
      const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      const node = grid[row][col];

      if (!isStart && !isEnd && Math.random() < 0.3) {
        cell.classList.add('wall');
        node.isWall = true;
      }
    }
  }
}

function applyGridSize() {
  const rowInput = document.getElementById('rowsInput');
  const colInput = document.getElementById('colsInput');

  const newRows = parseInt(rowInput.value);
  const newCols = parseInt(colInput.value);

  if (isNaN(newRows) || isNaN(newCols) || newRows < 5 || newCols < 5) {
    alert("Please enter valid grid size (min 5x5)");
    return;
  }

  rows = newRows;
  cols = newCols;
  START_ROW = Math.floor(rows / 2);
  START_COL = Math.floor(cols / 5);
  END_ROW = Math.floor(rows / 2);
  END_COL = cols - Math.floor(cols / 5);
  initializeGridData();
  createGrid();
}

initializeGridData();
createGrid();

window.applyGridSize = applyGridSize;
window.visualizeDijkstra = visualizeDijkstra;
window.visualizeBFS = visualizeBFS;
window.visualizeDFS = visualizeDFS;
window.clearPath = clearPath;
window.clearWalls = clearWalls;
window.generateRandomMaze = generateRandomMaze;

// export {
//   visualizeDijkstra,
//   visualizeBFS,
//   visualizeDFS,
//   clearPath,
//   clearWalls,
//   generateRandomMaze,
//   setGridSize
// };

