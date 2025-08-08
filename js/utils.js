// Convert board coordinates (row, col) to chess notation (e.g., 0,0 -> a8)
function toChessNotation(row, col) {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    return files[col] + (8 - row);
}

// Highlight possible moves in green overlay
function highlightSquares(squares) {
    removeHighlights();
    squares.forEach(([row, col]) => {
        const square = document.querySelector(`.square[data-row='${row}'][data-col='${col}']`);
        if (square) {
            square.classList.add("highlight");
        }
    });
}

// Remove all move highlights
function removeHighlights() {
    document.querySelectorAll(".highlight").forEach(sq => {
        sq.classList.remove("highlight");
    });
}

// Check if coordinates are inside board
function isInsideBoard(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}
