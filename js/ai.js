class GameAI {
    constructor() {
        this.DirectionScore = { 0: 0, 1: 0, 2: 0, 3: 0 }
        this.next = Math.floor(Math.random() * 4)
        this.NowD = -1
        this.EdgeX = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 3]
        this.EdgeY = [1, 0, 2, 3, 0, 3, 0, 3, 0, 1, 2, 3]
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
        console.log(NowGrid)
        // let StartTime = Date.now()
        this.DirectionScore = { 0: 0, 1: 0, 2: 0, 3: 0 }
        for (let i = 0; i < 4; i++) {
            this.NowD = i
            let grid = this.move(i, recursiveClone(NowGrid))
            if (grid[0] == null) {//不能移動
                this.DirectionScore[i] = -10000000
                continue
            }
            this.DirectionScore[i] += grid[1] * 2
            this.DirectionScore[i] += this.Jcomputer(grid[0], 2)
        }
        console.log(this.DirectionScore)
        this.next = this.BestD(this.DirectionScore)
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
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid.length; y++) {
                NewGrid[x].push(grid[y][x])
            }
        }
        return NewGrid
    }

    Jcomputer(grid, steps) {
        let grades = 0
        let count = 0
        if (steps < 1) {
            return 0
        }
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid.length; y++) {
                if (grid[y][x] == 0) {
                    count++
                    grid[y][x] = 2
                    grades += 0.8 * this.Jplayer(grid, steps)
                    grid[y][x] = 4
                    grades += 0.2 * this.Jplayer(grid, steps)
                    grid[y][x] = 0
                }
            }
        }
        return grades / count
    }
    Jplayer(NowGrid, steps) {
        steps--
        let grades = 0
        for (let i = 0; i < 4; i++) {
            grid = this.move(i, recursiveClone(NowGrid))
            // grades += grid[1]*0.1
            if (grid[0] == null) {
                return grades
            }
            grades += this.heuristics(grid[0])
            grades += this.Jcomputer(grid[0], steps, grades)
        }
        return grades
    }
    heuristics(grid) {
        let grades = 0
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid.length; y++) {
                if (grid[y][x] == 0) {
                    grades += 10
                }
            }
        }
        for (let i = 0; i < 12; i++) {
            if (grid[this.EdgeY[i]][this.EdgeX[i]]>64) {
                grades += 50
            }

        }
        return grades
    }
    BestD(AllD) {
        let max = -Infinity;
        let maxIndex = -1;

        for (let i = 0; i < 4; i++) {
            if (AllD[i] > max) {
                max = this.DirectionScore[i];
                maxIndex = i;
            }
        }
        return maxIndex
    }
}

function recursiveClone(val) {
    return Array.isArray(val) ? Array.from(val, recursiveClone) : val;
}


function create_previousState() {
    grid = [[],
    [],
    [],
    [2, 2, 2, 2]]
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