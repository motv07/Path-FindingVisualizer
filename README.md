# 🗺️ Pathfinding & Shortest Path Visualizer

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

A highly interactive, modern web application designed to visualize how various graph search and shortest-path algorithms navigate a grid. 

This project goes far beyond basic pathfinding by introducing **dynamic custom weights**, **mathematical path cost calculations**, **all-pairs shortest path visualization**, and **smooth asynchronous CSS animations**.

---

## ✨ Comprehensive Feature Set

### 🛠️ Interactive Grid & Editing Tools
* **Dynamic Grid Resizing:** Adjust grid dimensions on the fly (from a compact 5x5 up to a massive 100x100 matrix) without reloading the page.
* **Draggable Terminals:** Click and drag the Start (Green) and Target (Red) nodes in real-time to test different scenarios or rescue them from enclosed mazes.
* **Wall Drawing:** Paint impassable obstacles on the grid that algorithms must calculate routes around.
* **Dynamic Multi-Weights:** Assign custom traversal costs (from 2 to 99) to individual nodes. Algorithms will dynamically calculate the most cost-effective route, choosing longer physical paths if they require less "weight" toll to traverse.
* **Smart Maze Generation:** * **Random Scatter:** Instantly populate the grid with a randomized scattering of walls and weighted nodes.
  * **Prim's Algorithm (Perfect Maze):** Generates a fully connected "Perfect Maze" with only one valid solution path. *Includes custom logic to perfectly adapt to even-numbered grid dimensions without leaving bulky borders.*

### 🎨 Modern UI/UX & Animations
* **Real-Time Progress Bar:** Tracks the visualizer's exploration percentage and mathematically calculates the exact **Total Path Weight** once the target is found.
* **Sleek Dark Theme:** Built with a professional `#0f172a` slate/dark layout, Google Poppins typography, and high-contrast text shadows for readability.
* **CSS Keyframe Animations:** * *Wall Pop:* Smooth scaling animations when placing obstacles.
  * *Maze Carve:* Cool expanding animations as passages are carved out of solid blocks.
  * *Search Ripple:* Visited nodes expand and pulse with gradient color shifts as the algorithm explores.
  * *Shortest Path Glow:* The final optimized path illuminates in a bright yellow trace.
* **Safe Asynchronous Execution:** Advanced timeout tracking ensures that clearing the grid instantly halts any currently running visualizations without UI ghosting or overlaps.

## 🧠 Supported Algorithms

This visualizer implements both unweighted and weighted graph search algorithms, highlighting the difference between blind searching and cost-optimized routing.

### 🔍 Pathfinding Algorithms (The Solvers)
| Algorithm | Type | Weighted? | Time Complexity | Description |
| :--- | :--- | :---: | :--- | :--- |
| **Dijkstra's Algorithm** | Single-Source | ✅ Yes | $O(E \log V)$ | The gold standard for pathfinding. It guarantees the absolute shortest path by prioritizing the exploration of lowest-cost nodes first. |
| **Breadth-First Search (BFS)** | Single-Source | ❌ No | $O(V + E)$ | Explores all immediate neighbors equally in a "wave" pattern. Guarantees the shortest path *only* on unweighted grids. |
| **Depth-First Search (DFS)** | Single-Source | ❌ No | $O(V + E)$ | Plunges as deep as possible along a single branch before backtracking. *Implemented iteratively using a Stack to safely explore 10,000+ nodes without exceeding the browser's maximum call stack size.* |
| **Bellman-Ford** | Single-Source | ✅ Yes | $O(V \times E)$ | Computes shortest paths from a single source vertex to all other vertices. Mathematically supports negative edge weights. |
| **Floyd-Warshall** | All-Pairs | ✅ Yes | $O(V^3)$ | A dynamic programming algorithm that computes the shortest path between *every single pair* of nodes simultaneously.<br><br>⚠️ *Includes a software guardrail to prevent browser crashes on grids larger than 300 nodes, accompanied by an asynchronous "Calculating" UI state.* |

### 🏗️ Maze Generation Algorithms (The Builders)
| Algorithm | Type | Description |
| :--- | :--- | :--- |
| **Prim's Algorithm** | Randomized MST | Carves a "Perfect Maze" out of a solid grid of walls. It guarantees that the entire maze is fully connected with absolutely no loops, meaning there is only one mathematically unique path between the start and end nodes. |
| **Random Scatter** | Noise | Scatters individual walls and weighted nodes across the grid based on probability thresholds, creating an open-world environment perfect for testing Dijkstra's weight optimizations. |

---

## 💻 Tech Stack & Architecture

* **Frontend:** HTML5, CSS3 (Flexbox/Grid, `@keyframes`), Vanilla JavaScript (ES6+).
* **Architecture:** Modular codebase utilizing ES6 `import`/`export` for clean separation of UI components and algorithmic logic. No external libraries or frameworks are used.
* **Data Structures:** 2D Arrays (Matrices), Queues, Stacks, and Hash Maps.

### 📂 Directory Structure

```text
pathfinding-visualizer/
├── index.html                  # Main UI layout and control panel
├── style.css                   # Dark theme, layout, and CSS animations
├── script.js                   # State management, DOM manipulation, and timeout handling
└── algorithms/
    ├── bfs.js                  # Breadth-First Search (Queue)
    ├── dfs.js                  # Depth-First Search (Iterative Stack)
    ├── dijkstra.js             # Dijkstra's Algorithm
    ├── bellmanFord.js          # Bellman-Ford implementation
    ├── primsMaze.js            # Prim's Maze Generation
    └── floydWarshall.js        # Floyd-Warshall dynamic programming
```
## Getting Started
Because this project utilizes strict ES6 Modules for file separation, modern web browsers will block local file:// execution due to CORS policies. You must run this project via a local web server.

Method 1: Visual Studio Code (Recommended)
Clone the repository to your local machine:

```bash
git clone https://github.com/motv07/Path-FindingVisualizer.git
```
Open the project folder in VS Code.

Install the Live Server extension (by Ritwick Dey) from the extensions marketplace.

Right-click on index.html and select "Open with Live Server". The visualizer will launch in your default browser.

Method 2: Python HTTP Server
If you have Python installed on your system, you can easily spin up a local server.

Open your terminal and navigate to the project directory:

```bash
cd path/to/pathfinding-visualizer
```
Start the server:

```bash
python -m http.server 8000
```
(Note: Use python3 if you are on macOS/Linux).

Open your web browser and navigate to http://localhost:8000.

Method 3: Node.js (http-server)
Open your terminal in the project directory.

Run the following command (requires Node.js/npm to be installed):

```bash
npx http-server
```
Navigate to the provided URL (typically http://127.0.0.1:8080).

## Usage Instructions
1. Configure the Grid: Use the R: (Rows) and C: (Columns) inputs to set your desired board size, then click Set Grid.

2. Select Draw Mode: Choose whether you want to draw Walls (impassable) or Weights (high cost).

3. Assign Custom Weights: If drawing weights, type any number between 2 and 99 into the weight input box before drawing on the grid.

4. Draw Map or Generate Maze: Click and drag your mouse across the grid to construct obstacles, or click Prim's Maze / Random Maze to auto-generate terrain.

5. Visualize: Click any algorithmic button (e.g., Dijkstra, BFS) to watch the search execution. Monitor the progress bar to see exploration percentage and final path weights!

6. Reset: * Click Clear Path to wipe the search visualization while keeping your walls/weights intact.

7. Click Reset Grid to start completely from scratch.
