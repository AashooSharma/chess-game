// timer.js

let whiteTime = 600; // 10 min in seconds
let blackTime = 600;
let whiteInterval = null;
let blackInterval = null;
let firstMoveDone = false;

const whiteTimerEl = document.getElementById("white-timer");
const blackTimerEl = document.getElementById("black-timer");

function updateDisplay() {
    whiteTimerEl.textContent = formatTime(whiteTime);
    blackTimerEl.textContent = formatTime(blackTime);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function startWhiteTimer() {
    stopTimers();
    whiteInterval = setInterval(() => {
        if (whiteTime > 0) {
            whiteTime--;
            updateDisplay();
        }
    }, 1000);
}

function startBlackTimer() {
    stopTimers();
    blackInterval = setInterval(() => {
        if (blackTime > 0) {
            blackTime--;
            updateDisplay();
        }
    }, 1000);
}

function stopTimers() {
    clearInterval(whiteInterval);
    clearInterval(blackInterval);
}

function handleTurnChange(currentTurn) {
    if (!firstMoveDone) {
        if (currentTurn === "black") {
            firstMoveDone = true;
            startBlackTimer(); // Start black's timer after white's first move
        }
        return;
    }

    if (currentTurn === "white") {
        startWhiteTimer();
    } else {
        startBlackTimer();
    }
}

updateDisplay();
