#  Pathfinding & Shortest Path Visualizer

A highly interactive, modern web application designed to visualize how various graph search and shortest-path algorithms navigate a grid. This project goes beyond basic pathfinding by introducing **dynamic custom weights**, **all-pairs shortest path visualization**, and **smooth CSS keyframe animations**.

##  Comprehensive Feature Set

###  Interactive Grid & Editing Tools
* **Dynamic Grid Resizing:** Adjust the grid dimensions on the fly (from a compact 5x5 up to a massive 100x100 matrix) without reloading the page.
* **Draggable Terminals:** Click and drag the Start (Green) and Target (Red) nodes in real-time to test different scenarios.
* **Wall Drawing:** Paint impassable obstacles on the grid that algorithms must calculate routes around.
* **Dynamic Multi-Weights:** Assign custom traversal costs (from 2 to 99) to individual nodes. Algorithms will dynamically calculate the most cost-effective route, choosing longer physical paths if they require less "weight" to traverse.
* **Random Maze Generation:** Instantly populate the grid with a randomized scattering of walls and weighted nodes (costs ranging from 2-10) for quick testing.

###  Modern UI/UX & Animations
* **Sleek Dark Theme:** Built with a professional `#0f172a` slate/dark layout and Google Poppins typography.
* **CSS Keyframe Animations:** * *Wall Pop:* Smooth scaling animations when placing obstacles.
  * *Search Ripple:* Visited nodes expand and pulse with gradient color shifts as the algorithm explores.
  * *Shortest Path Glow:* The final optimized path illuminates in a bright yellow trace.
* **Ghost-Animation Prevention:** Advanced asynchronous timeout tracking ensures that clearing the grid instantly halts any currently running visualizations without UI glitches.

---

##  Supported Algorithms

This visualizer implements both unweighted and weighted graph search algorithms, highlighting the difference between blind searching and cost-optimized routing.

| Algorithm | Type | Weighted? | Time Complexity | Description |
| :--- | :--- | :---: | :--- | :--- |
| **Dijkstra's Algorithm** | Single-Source | ✅ Yes | $O(E \log V)$ | The gold standard for pathfinding. It guarantees the absolute shortest path by prioritizing the exploration of lowest-cost nodes first. |
| **Breadth-First Search (BFS)** | Single-Source | ❌ No | $O(V + E)$ | Explores all immediate neighbors equally in a "wave" pattern. Guarantees the shortest path *only* on unweighted grids. |
| **Depth-First Search (DFS)** | Single-Source | ❌ No | $O(V + E)$ | Plunges as deep as possible along a single branch before backtracking. It is a poor choice for pathfinding as it **does not** guarantee the shortest path. |
| **Bellman-Ford** | Single-Source | ✅ Yes | $O(V \times E)$ | Computes shortest paths from a single source vertex to all other vertices. While slower than Dijkstra, it mathematically supports negative edge weights. |
| **Floyd-Warshall** | All-Pairs | ✅ Yes | $O(V^3)$ | A dynamic programming algorithm that computes the shortest path between *every single pair* of nodes simultaneously.<br><br>⚠️ **Warning:** *Because this algorithm runs in cubic time, it is highly recommended to shrink the grid to 10x10 or 15x15 before execution to prevent browser bottlenecking.* |

---

##  Tech Stack & Architecture

* **Frontend:** HTML5, CSS3 (Flexbox/Grid, `@keyframes`), Vanilla JavaScript (ES6+).
* **Architecture:** Modular codebase utilizing ES6 `import`/`export` for clean separation of UI logic and algorithmic logic.
* **Data Structures:** 2D Arrays (Matrices), Queues, and Hash Maps.

###  Directory Structure

```text
pathfinding-visualizer/
├── index.html                  # Main UI layout and control panel
├── style.css                   # Dark theme, layout, and CSS animations
├── script.js                   # State management, DOM manipulation, and timeout handling
└── algorithms/
    ├── bfs.js                  # Breadth-First Search implementation
    ├── dfs.js                  # Depth-First Search implementation
    ├── dijkstra.js             # Dijkstra's Algorithm implementation
    ├── bellmanFord.js          # Bellman-Ford implementation
    └── floydWarshall.js        # Floyd-Warshall dynamic programming implementation
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

4. Draw: Click and drag your mouse across the grid to construct your map.

5. Visualize: Click any of the algorithmic buttons (e.g., Dijkstra, Bellman-Ford) to watch the search execution.

6. Reset: * Click Clear Path to wipe the search visualization while keeping your walls/weights intact.

7. Click Reset Grid to start completely from scratch.