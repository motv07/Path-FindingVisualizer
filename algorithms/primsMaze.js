export function generatePrimsMaze(grid, rows, cols) {
    const wallsToAnimate = [];
    
    // 1. Initially set everything to walls
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            grid[r][c].isWall = true;
            wallsToAnimate.push(grid[r][c]);
        }
    }

    const wallsList = [];
    const startR = 1;
    const startC = 1;
    
    grid[startR][startC].isWall = false;

    const dr = [-2, 2, 0, 0];
    const dc = [0, 0, -2, 2];

    for (let i = 0; i < 4; i++) {
        const nr = startR + dr[i];
        const nc = startC + dc[i];
        if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1) {
            wallsList.push({ r: nr, c: nc, pr: startR, pc: startC });
        }
    }

    // 2. Carve the main maze using Prim's logic
    while (wallsList.length > 0) {
        const randomIndex = Math.floor(Math.random() * wallsList.length);
        const wall = wallsList[randomIndex];
        wallsList.splice(randomIndex, 1);

        const r = wall.r;
        const c = wall.c;
        const pr = wall.pr;
        const pc = wall.pc;

        if (grid[r][c].isWall) {
            grid[r][c].isWall = false;
            const midR = r + (pr - r) / 2;
            const midC = c + (pc - c) / 2;
            grid[midR][midC].isWall = false;

            wallsToAnimate.push(grid[r][c], grid[midR][midC]);

            for (let i = 0; i < 4; i++) {
                const nr = r + dr[i];
                const nc = c + dc[i];
                if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && grid[nr][nc].isWall) {
                    wallsList.push({ r: nr, c: nc, pr: r, pc: c });
                }
            }
        }
    }

    // --- NEW FIX: EXTEND PATHS FOR EVEN GRIDS ---
    
    // If the grid has an even number of rows, extend vertical paths down by 1 cell
    if (rows % 2 === 0) {
        for (let c = 1; c < cols - 1; c++) {
            if (!grid[rows - 3][c].isWall) {
                grid[rows - 2][c].isWall = false;
                wallsToAnimate.push(grid[rows - 2][c]);
            }
        }
    }

    // If the grid has an even number of cols, extend horizontal paths right by 1 cell
    if (cols % 2 === 0) {
        for (let r = 1; r < rows - 1; r++) {
            if (!grid[r][cols - 3].isWall) {
                grid[r][cols - 2].isWall = false;
                wallsToAnimate.push(grid[r][cols - 2]);
            }
        }
    }
    // ---------------------------------------------

    // 3. Clean up the animation array to show the final solid walls
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c].isWall) {
                wallsToAnimate.push(grid[r][c]);
            }
        }
    }

    return wallsToAnimate;
}