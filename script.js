import { bfs } from "./algorithms/bfs.js";
import { dijkstra } from "./algorithms/dijkstra.js";
import { dfs } from "./algorithms/dfs.js";
import { bellmanFord } from "./algorithms/bellmanFord.js";
import { floydWarshall } from "./algorithms/floydWarshall.js";
import { generatePrimsMaze } from './algorithms/primsMaze.js';

const gridContainer = document.getElementById('grid');
let rows = 20;
let cols = 50;
let START_ROW = 10;
let START_COL = 5;
let END_ROW = 10;
let END_COL = 44;

let totalAnimationSteps = 0;
let currentStep = 0;
let isDraggingStart = false;
let isDraggingEnd = false;
let isDrawing = false;
let currentDrawMode = 'wall';
let grid = [];
let animationTimeouts = [];

function clearAllTimeouts() {
  for (let i = 0; i < animationTimeouts.length; i++) {
    clearTimeout(animationTimeouts[i]);
  }
  animationTimeouts = [];
}

function updateDrawMode(mode) {
  currentDrawMode = mode;
}

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
          isDrawing = true;
          modifyCell(cell);
        }
      });

      cell.addEventListener('mouseenter', () => {
        if (isDraggingStart) {
          moveStartTo(cell);
        } else if (isDraggingEnd) {
          moveEndTo(cell);
        } else if (isDrawing) {
          modifyCell(cell);
        }
      });

      cell.addEventListener('mouseup', () => {
        isDraggingStart = false;
        isDraggingEnd = false;
        isDrawing = false;
      });

      gridContainer.appendChild(cell);
    }
  }
}

document.addEventListener('mouseup', () => {
  isDraggingStart = false;
  isDraggingEnd = false;
  isDrawing = false;
});

function modifyCell(cell) {
  if (cell.classList.contains('start') || cell.classList.contains('end')) return;

  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  const node = grid[row][col];

  if (currentDrawMode === 'wall') {
    cell.classList.remove('weight');
    node.weight = 1;
    cell.textContent = '';
    
    cell.classList.add('wall');
    node.isWall = true;
  } else if (currentDrawMode === 'weight') {
    cell.classList.remove('wall');
    node.isWall = false;
    
    // Get the dynamic weight from the input field
    const weightInput = document.getElementById('weightValue').value;
    const weightVal = parseInt(weightInput) || 5;

    cell.classList.add('weight');
    node.weight = weightVal;
    cell.textContent = weightVal;
  }
}

function moveStartTo(cell) {
  const oldStart = document.querySelector('.start');
  if (oldStart) oldStart.classList.remove('start');

  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  cell.classList.remove('wall');
  cell.classList.remove('weight');
  cell.textContent = '';
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
  cell.classList.remove('weight');
  cell.textContent = '';
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
      const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      let cellWeight = 1;
      let cellIsWall = false;
      
      if (cellElement) {
        if (cellElement.classList.contains('weight')) {
           // Read the text content of the cell to get its unique weight
           cellWeight = parseInt(cellElement.textContent) || 1;
        }
        if (cellElement.classList.contains('wall')) cellIsWall = true;
      }

      const cell = {
        row,
        col,
        isStart: row === START_ROW && col === START_COL,
        isEnd: row === END_ROW && col === END_COL,
        distance: Infinity,
        weight: cellWeight,
        isVisited: false,
        isWall: cellIsWall,
        previousNode: null,
      };
      currentRow.push(cell);
    }
    grid.push(currentRow);
  }
}

function animateVisitedNodes(visitedNodes) {
  // Reset counters for the new animation
  currentStep = 0;
  totalAnimationSteps = visitedNodes.length;
  
  const progressBar = document.getElementById('progressBar');
  progressBar.classList.remove('finished');

  for (let i = 0; i <= visitedNodes.length; i++) {
    if (i === visitedNodes.length) {
      animationTimeouts.push(setTimeout(() => {
        animateShortestPath(grid[END_ROW][END_COL]);
      }, 10 * i));
      return;
    }
    
    animationTimeouts.push(setTimeout(() => {
      // --- Progress Bar Logic ---
      currentStep++;
      const percent = Math.floor((currentStep / totalAnimationSteps) * 100);
      progressBar.style.width = `${percent}%`;
      progressBar.textContent = `Searching... ${percent}%`;
      // --------------------------

      const node = visitedNodes[i];
      const cell = document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`);
      if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
        cell.classList.add('visited');
      }
    }, 10 * i));
  }
}

function animateShortestPath(endNode) {
  if (endNode.previousNode === null) {
    setTimeout(() => {
      alert("Target is trapped! No path found.");
      document.getElementById('progressBar').textContent = "Trapped!";
      document.getElementById('progressBar').style.backgroundColor = "#ef4444"; // Red
    }, 500);
    return;
  }

  const nodesInPath = [];
  let current = endNode;
  
  while (current !== null) {
    nodesInPath.unshift(current);
    current = current.previousNode;
  }

  // --- NEW: Calculate Total Path Weight ---
  let totalPathWeight = 0;
  // Start loop at 1 to skip the Start Node (index 0)
  for (let i = 1; i < nodesInPath.length; i++) {
    totalPathWeight += nodesInPath[i].weight;
  }
  // ----------------------------------------

  const progressBar = document.getElementById('progressBar');

  for (let i = 0; i < nodesInPath.length; i++) {
    animationTimeouts.push(setTimeout(() => {
      const node = nodesInPath[i];
      const cell = document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`);
      if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
        cell.classList.remove('visited');
        cell.classList.add('path');
      }

      // Finish the progress bar when the shortest path is fully drawn
      if (i === nodesInPath.length - 1) {
        progressBar.classList.add('finished');
        // Inject the final weight into the text!
        progressBar.textContent = `Path Found! Total Path Weight: ${totalPathWeight}`;
      }
    }, 30 * i));
  }
}

function animatePrimsMaze() {
  clearWalls(); 
  const wallsToAnimate = generatePrimsMaze(grid, rows, cols); 
  
  // FIX: Force the Start and End nodes to remain open in the logic matrix
  grid[START_ROW][START_COL].isWall = false;
  grid[END_ROW][END_COL].isWall = false;

  for (let i = 0; i < wallsToAnimate.length; i++) {
    animationTimeouts.push(setTimeout(() => {
      const node = wallsToAnimate[i];
      
      const element = document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`);
      
      if (!element.classList.contains('start') && !element.classList.contains('end')) {
        if (node.isWall) {
          element.classList.add('wall'); 
        } else {
          element.classList.remove('wall');
          element.classList.add('maze-passage'); 
        }
      }
    }, 10 * i));
  }
}

function clearPath() {
  clearAllTimeouts();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      const node = grid[row][col];

      // Clean up the animation classes instead of hardcoded background colors
      cell.classList.remove('visited', 'path');

      node.distance = Infinity;
      node.isVisited = false;
      node.previousNode = null;
    }
  }
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = '100%';
    progressBar.style.backgroundColor = '#3b82f6';
    progressBar.textContent = 'Ready';
    progressBar.classList.remove('finished');
  }
}

function clearWalls() {
  clearAllTimeouts();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      const node = grid[row][col];

      // FIX: Added 'maze-passage' to the removal list
      cell.classList.remove('visited', 'path', 'wall', 'weight', 'maze-passage');
      cell.textContent = ''; // clear weight numbers

      node.isWall = false;
      node.weight = 1;
      node.distance = Infinity;
      node.isVisited = false;
      node.previousNode = null;
    }
  }
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = '100%';
    progressBar.style.backgroundColor = '#3b82f6';
    progressBar.textContent = 'Ready';
    progressBar.classList.remove('finished');
  }
}

function visualizeDijkstra() {
  clearPath();
  const startNode = grid[START_ROW][START_COL];
  const endNode = grid[END_ROW][END_COL];
  const visitedNodes = dijkstra(grid, startNode, endNode);
  animateVisitedNodes(visitedNodes);
}

function visualizeBFS() {
  clearPath();
  const startNode = grid[START_ROW][START_COL];
  const endNode = grid[END_ROW][END_COL];
  const visitedNodes = bfs(grid, startNode, endNode);
  animateVisitedNodes(visitedNodes);
}

function visualizeDFS() {
  clearPath();
  const startNode = grid[START_ROW][START_COL];
  const endNode = grid[END_ROW][END_COL];
  const visitedNodes = dfs(grid, startNode, endNode);
  animateVisitedNodes(visitedNodes);
}

function visualizeBellmanFord() {
  clearPath();
  const startNode = grid[START_ROW][START_COL];
  const endNode = grid[END_ROW][END_COL];
  const visitedNodes = bellmanFord(grid, startNode, endNode);
  animateVisitedNodes(visitedNodes);
}

function visualizeFloydWarshall() {
  const totalNodes = rows * cols;
  if (totalNodes > 90000) {
    alert(`Grid is too large for Floyd-Warshall (${totalNodes} nodes). Please set the grid to 15x15 or smaller to prevent your browser from crashing!`);
    return;
  }

  // 1. Clear the board
  clearPath();

  // 2. Instantly update the UI to show the algorithm is "thinking"
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = '100%';
    progressBar.style.backgroundColor = '#f59e0b'; // Amber/Orange color
    progressBar.textContent = 'Calculating Matrix (Heavy Math)... Please wait.';
  }

  // 3. Wait 50ms so the browser can actually draw the Orange bar BEFORE it freezes
  setTimeout(() => {
    const startNode = grid[START_ROW][START_COL];
    const endNode = grid[END_ROW][END_COL];
    
    // The browser tab will freeze here for a split second to do the math
    const visitedNodes = floydWarshall(grid, startNode, endNode);
    
    // Once finished, animate the exact path
    animateVisitedNodes(visitedNodes);
  }, 50); 
}

function applyGridSize() {
  clearAllTimeouts();
  const rowInput = document.getElementById('rowsInput');
  const colInput = document.getElementById('colsInput');

  let newRows = parseInt(rowInput.value);
  let newCols = parseInt(colInput.value);

  if (isNaN(newRows) || isNaN(newCols) || newRows < 5 || newCols < 5) {
    alert("Please enter valid grid size (min 5x5)");
    return;
  }

  // Set them exactly to what the user typed (no odd forcing)
  rows = newRows;
  cols = newCols;

  START_ROW = Math.floor(rows / 2);
  START_COL = Math.floor(cols / 5);
  END_ROW = Math.floor(rows / 2);
  END_COL = cols - Math.floor(cols / 5);
  initializeGridData();
  createGrid();
}

function generateRandomMaze() {
  clearWalls();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isStart = row === START_ROW && col === START_COL;
      const isEnd = row === END_ROW && col === END_COL;
      const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      const node = grid[row][col];

      if (!isStart && !isEnd) {
        if (Math.random() < 0.25) {
          cell.classList.add('wall');
          node.isWall = true;
        } else if (Math.random() < 0.1) {
          // Generate a random weight between 2 and 10
          const randomWeight = Math.floor(Math.random() * 9) + 2; 
          cell.classList.add('weight');
          node.weight = randomWeight;
          cell.textContent = randomWeight;
        }
      }
    }
  }
}

initializeGridData();
createGrid();

window.updateDrawMode = updateDrawMode;
window.applyGridSize = applyGridSize;
window.visualizeDijkstra = visualizeDijkstra;
window.visualizeBFS = visualizeBFS;
window.visualizeDFS = visualizeDFS;
window.visualizeBellmanFord = visualizeBellmanFord;
window.visualizeFloydWarshall = visualizeFloydWarshall;
window.clearPath = clearPath;
window.clearWalls = clearWalls;
window.generateRandomMaze = generateRandomMaze;
window.animatePrimsMaze = animatePrimsMaze;