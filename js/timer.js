let whiteTime = 300; // seconds (5 minutes)
let blackTime = 300; // seconds (5 minutes)
let whiteTimerInterval, blackTimerInterval;

function startWhiteTimer() {
    stopTimers();
    whiteTimerInterval = setInterval(() => {
        whiteTime--;
        updateTimerDisplay("white-timer", whiteTime);
        if (whiteTime <= 0) {
            alert("⏳ White's time is over! Black wins!");
            stopTimers();
        }
    }, 1000);
}

function startBlackTimer() {
    stopTimers();
    blackTimerInterval = setInterval(() => {
        blackTime--;
        updateTimerDisplay("black-timer", blackTime);
        if (blackTime <= 0) {
            alert("⏳ Black's time is over! White wins!");
            stopTimers();
        }
    }, 1000);
}

function stopTimers() {
    clearInterval(whiteTimerInterval);
    clearInterval(blackTimerInterval);
}

function updateTimerDisplay(elementId, timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    document.getElementById(elementId).textContent =
        `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// This function will be called whenever the turn changes
function switchTimer(turn) {
    if (turn === "white") {
        startWhiteTimer();
    } else {
        startBlackTimer();
    }
}
