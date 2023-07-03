let AI = new GameAI()
let EXECUTION_STEP_INTERVAL = 300
let isAI_OPEN = false
const AIinput = document.getElementById("AIinput")
AIinput.addEventListener("change", () => {
    EXECUTION_STEP_INTERVAL = parseFloat(AIinput.value) > 10 ? parseFloat(AIinput.value) : 10
})
const AIisOpen = document.getElementById("AIisOpen")
AIisOpen.addEventListener("change", () => {
    isAI_OPEN = AIisOpen.checked
})
let grid
let LastTimestamp = 0
let temp_EXECUTION_STEP_INTERVAL = EXECUTION_STEP_INTERVAL
function step(timestamp) {
    if ((jx06_GameManager.keepPlaying ||!jx06_GameManager.over)&&timestamp - LastTimestamp > temp_EXECUTION_STEP_INTERVAL && isAI_OPEN) {
        next = AI.GetNextStep()
        if(next == null){
            temp_EXECUTION_STEP_INTERVAL = 5
            return
        }
        grid = jx06_GameManager.move(next)
        LastTimestamp = timestamp
        grid = AI.GridToGrid(grid)
        AI.calculation(grid)
        temp_EXECUTION_STEP_INTERVAL = EXECUTION_STEP_INTERVAL
    }
    window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);