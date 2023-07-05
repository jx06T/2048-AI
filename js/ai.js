class GameAI {
    constructor() {
        this.DirectionScore = { 0: 0, 1: 0, 2: 0, 3: 0 }
        this.next = Math.floor(Math.random() * 4)
        this.EdgeX = [0, 0, 3, 3, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 3]
        this.EdgeY = [0, 3, 0, 3, 1, 0, 2, 3, 0, 3, 0, 3, 0, 1, 2, 3]
    }
    GetNextStep() {
        let next = this.next
        this.next = null
        return next
    }
    GridToGrid(grid) {
        let NewGrid = [[], [], [], []]
        for (let x = 0; x < grid.size; x++) {
            for (let y = 0; y < grid.size; y++) {
                NewGrid[y].push(grid.cells[x][y] != null ? grid.cells[x][y].value : 0)
            }
        }
        return NewGrid
    }


    calculation(NowGrid) {
        // let StartTime = Date.now()
        let best = null
        let BestScore = -Infinity
        for (let i = 0; i < 4; i++) {
            let grid = this.move(i, recursiveClone(NowGrid))
            if (grid[0] == null) {//不能移動
                continue
            }
            let score = this.expectimax(grid[0], 5, false)
            score += grid[1] * 2.5
            if (score > BestScore) {
                BestScore = score
                best = i
            }
        }
        this.next = best
        // console.log((Date.now() - StartTime) / 1000)
    }
    move(d, grid) {
        let score = 0;
        let old = recursiveClone(grid)
        let V = jx06_GameManager.getVector(d)
        if (V.y != 0) grid = this.ChangeGrid(grid)
        for (let i = 0; i < grid.length; i++) {
            grid[i] = grid[i].filter((num) => num !== 0);
            let jj = V.x + V.y < 0 ? 0 : grid[i].length - 1
            for (let j = 0; j < grid[i].length; j++) {
                let c1 = grid[i][jj]
                let c2 = grid[i][jj - (V.x + V.y)]
                if (c1 == c2) {
                    grid[i][jj] = c1 * 2
                    score += c1 * 2
                    grid[i].splice(grid[i].indexOf(c2), 1);
                }
                jj -= (V.x + V.y)
            }
            while (grid[i].length < 4) {
                grid[i].splice(2 + (V.x + V.y) * -2, 0, 0);
            }
        }
        if (V.y != 0) grid = this.ChangeGrid(grid)
        if (JSON.stringify(old) == JSON.stringify(grid)) grid = null
        return [grid, score]
    }
    ChangeGrid(grid) {
        let NewGrid = [[], [], [], []]
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                NewGrid[x].push(grid[y][x])
            }
        }
        return NewGrid
    }
    expectimax(grid, depth, isJplayer) {
        if (depth == 0) {
            // console.log(this.heuristics(grid))
            return this.heuristics(grid)
        }
        if (isJplayer) {
            let BestScore = 0
            for (let i = 0; i < 4; i++) {
                let NewGrid = this.move(i, recursiveClone(grid))
                if (NewGrid[0] == null) {
                    continue
                }
                let score = this.expectimax(NewGrid[0], depth - 1, false)
                score += NewGrid[1] * 2
                BestScore = Math.max(BestScore, score)
            }
            return BestScore
        } else {
            let count = 0
            let AllScole = 0
            for (let x = 0; x < 4; x++) {
                for (let y = 0; y < 4; y++) {
                    if (grid[y][x] == 0) {
                        count++
                        grid[y][x] = 2
                        AllScole += 0.8 * this.expectimax(grid, depth - 1, true)
                        grid[y][x] = 4
                        AllScole += 0.2 * this.expectimax(grid, depth - 1, true)
                        grid[y][x] = 0
                    }
                }
            }
            return AllScole / count
        }
    }
    heuristics(grid) {
        let score = 0
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid.length; y++) {
                if (grid[y][x] == 0) {
                    score += 15
                }
            }
        }
        for (let i = 0; i < 12; i++) {
            // if (grid[this.EdgeY[i]][this.EdgeX[i]] > 64) {
            score += grid[this.EdgeY[i]][this.EdgeX[i]] / 2
            // }

        }
        return score
    }
}

function recursiveClone(val) {
    return Array.isArray(val) ? Array.from(val, recursiveClone) : val;
}


function create_previousState() {
    grid = [[],
    [],
    [2],
    [2, 2, 4, 8]]
    grid = null
    if (grid == null) {
        return null
    }
    let NewGrid = [[], [], [], []]
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid.length; y++) {
            aCell = grid[x][y]
            if (aCell == 0 || aCell == undefined) {
                NewGrid[y].push(null)
                continue
            }
            NewGrid[y].push(
                { position: { x: y, y: x }, value: aCell })
        }
    }
    return { cells: NewGrid, size: 4 }
}
// grid = [[32768, 16384, 8192, 4096],
// [256, 512, 1024, 2048],
// [128, 64, 32, 16],
// [2, 2, 4, 8]]