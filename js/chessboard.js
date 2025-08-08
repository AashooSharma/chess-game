// Get player names from URL
const urlParams = new URLSearchParams(window.location.search);
const player1Name = urlParams.get("player1") || "White";
const player2Name = urlParams.get("player2") || "Black";

// DOM elements
const boardContainer = document.getElementById("chessboard");
const turnDisplay = document.getElementById("turn-display");
const player1Timer = document.getElementById("player1-timer");
const player2Timer = document.getElementById("player2-timer");

// Game state
let boardState = [];
let selectedSquare = null;
let currentTurn = "white"; // White moves first

// Initialize
function initChessboard() {
    boardState = getInitialBoard(); // from rules.js

    // Create 64 squares (back layer)
    boardContainer.innerHTML = "";
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.className = `square ${(row + col) % 2 === 0 ? "white" : "black"}`;
            square.dataset.row = row;
            square.dataset.col = col;
            square.addEventListener("click", onSquareClick);
            boardContainer.appendChild(square);
        }
    }

    renderPieces();
    updateTurnDisplay();
}

// Render pieces (top layer)
function renderPieces() {
    document.querySelectorAll(".square").forEach(sq => sq.innerHTML = "");

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = boardState[row][col];
            if (piece) {
                const pieceElem = document.createElement("span");
                pieceElem.className = "piece";
                pieceElem.textContent = getPieceSymbol(piece); // from rules.js
                document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`).appendChild(pieceElem);
            }
        }
    }
}

// Click handler
function onSquareClick(e) {
    const row = parseInt(e.currentTarget.dataset.row);
    const col = parseInt(e.currentTarget.dataset.col);
    const clickedPiece = boardState[row][col];

    if (selectedSquare) {
        const [fromRow, fromCol] = selectedSquare;
        const fromPiece = boardState[fromRow][fromCol];

        // Check if valid move
        if (isValidMove(fromRow, fromCol, row, col, fromPiece, boardState, currentTurn)) {
            boardState[row][col] = fromPiece;
            boardState[fromRow][fromCol] = "";
            selectedSquare = null;
            clearHighlights();
            changeTurn();
        } else {
            selectedSquare = null;
            clearHighlights();
        }

        renderPieces();
    } else {
        // Select piece only if it's the current player's turn
        if (clickedPiece && getPieceColor(clickedPiece) === currentTurn) {
            selectedSquare = [row, col];
            showHighlights(getValidMoves(row, col, clickedPiece, boardState)); // from rules.js
        }
    }
}

// Highlight possible moves (middle layer)
function showHighlights(moves) {
    clearHighlights();
    moves.forEach(([r, c]) => {
        document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`).classList.add("highlight");
    });
}

function clearHighlights() {
    document.querySelectorAll(".square").forEach(sq => sq.classList.remove("highlight"));
}

// Turn handling
function changeTurn() {
    currentTurn = currentTurn === "white" ? "black" : "white";
    updateTurnDisplay();
    startPlayerTimer(currentTurn); // from timer.js
}

function updateTurnDisplay() {
    turnDisplay.textContent = `${currentTurn === "white" ? player1Name : player2Name}'s Turn`;
}

// Start game
initChessboard();
startPlayerTimer(currentTurn); // Start white's timer at game start
