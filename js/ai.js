class GameAI {
    constructor() {
        this.depth = 8;
        this.speed = 300;
        this.listen()
    }
    // Restart the game
    GetNextStep() {
        return Math.floor(Math.random() * 4)
    }
    listen() {
        const AIinput = document.getElementById("AIinput")
        // AIinput.addEventListener("keydown", (event) => {
        //     if (event.key === "Enter") {
        //         event.target.blur();
        //     }
        // })
        AIinput.addEventListener("change", () => {
            this.speed = parseFloat(AIinput.value)
        })
        const AIisOpen = document.getElementById("AIisOpen")
        AIisOpen.addEventListener("change", () => {
            // console.log(AIisOpen.checked)
        })
    }
}

