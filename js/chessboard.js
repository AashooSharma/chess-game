// js/chessboard.js

// Pieces Unicode
const pieces = {
    w: { pawn: "♙", rook: "♖", knight: "♘", bishop: "♗", queen: "♕", king: "♔" },
    b: { pawn: "♟", rook: "♜", knight: "♞", bishop: "♝", queen: "♛", king: "♚" }
};

// Initial Board Setup
let boardState = [
    ["b_rook", "b_knight", "b_bishop", "b_queen", "b_king", "b_bishop", "b_knight", "b_rook"],
    ["b_pawn", "b_pawn", "b_pawn", "b_pawn", "b_pawn", "b_pawn", "b_pawn", "b_pawn"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["w_pawn", "w_pawn", "w_pawn", "w_pawn", "w_pawn", "w_pawn", "w_pawn", "w_pawn"],
    ["w_rook", "w_knight", "w_bishop", "w_queen", "w_king", "w_bishop", "w_knight", "w_rook"]
];

let selected = null;
let possibleMoves = [];
let currentTurn = "w"; // White starts

// Chessboard container
const boardElement = document.getElementById("chessboard");

// Render Board Function
function renderBoard() {
    boardElement.innerHTML = "";

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.className = "square " + ((row + col) % 2 === 0 ? "white" : "black");
            square.dataset.row = row;
            square.dataset.col = col;

            // Highlight possible moves
            if (possibleMoves.some(m => m.row === row && m.col === col)) {
                square.classList.add("highlight");
            }

            const piece = boardState[row][col];
            if (piece) {
                const [color, type] = piece.split("_");
                square.textContent = pieces[color][type];
            }

            square.addEventListener("click", () => handleSquareClick(row, col));

            boardElement.appendChild(square);
        }
    }
}

// Handle Square Click
function handleSquareClick(row, col) {
    const piece = boardState[row][col];

    // Select piece if it's current turn's piece
    if (piece && piece.startsWith(currentTurn)) {
        selected = { row, col, piece };
        possibleMoves = getValidMoves(row, col, piece);
    }
    // If clicked on a highlighted move square
    else if (selected && possibleMoves.some(m => m.row === row && m.col === col)) {
        boardState[row][col] = selected.piece;
        boardState[selected.row][selected.col] = "";
        selected = null;
        possibleMoves = [];

        // Switch turn
        currentTurn = currentTurn === "w" ? "b" : "w";
        switchTimer(currentTurn);
    } else {
        selected = null;
        possibleMoves = [];
    }

    renderBoard();
}

// Get Valid Moves (simple rules)
function getValidMoves(fromRow, fromCol, piece) {
    const moves = [];
    const [color, type] = piece.split("_");

    const directions = {
        rook: [[1,0],[-1,0],[0,1],[0,-1]],
        bishop: [[1,1],[1,-1],[-1,1],[-1,-1]],
        queen: [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],
        king: [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],
        knight: [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]
    };

    if (type === "pawn") {
        const dir = color === "w" ? -1 : 1;
        if (boardState[fromRow + dir] && boardState[fromRow + dir][fromCol] === "") {
            moves.push({ row: fromRow + dir, col: fromCol });
        }
    }
    else if (type === "knight") {
        for (let [dr, dc] of directions.knight) {
            const r = fromRow + dr, c = fromCol + dc;
            if (r >= 0 && r < 8 && c >= 0 && c < 8 && !boardState[r][c].startsWith(color)) {
                moves.push({ row: r, col: c });
            }
        }
    }
    else if (["rook","bishop","queen"].includes(type)) {
        for (let [dr, dc] of directions[type]) {
            let r = fromRow + dr, c = fromCol + dc;
            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                if (boardState[r][c] === "") {
                    moves.push({ row: r, col: c });
                } else {
                    if (!boardState[r][c].startsWith(color)) {
                        moves.push({ row: r, col: c });
                    }
                    break;
                }
                r += dr; c += dc;
            }
        }
    }
    else if (type === "king") {
        for (let [dr, dc] of directions.king) {
            const r = fromRow + dr, c = fromCol + dc;
            if (r >= 0 && r < 8 && c >= 0 && c < 8 && !boardState[r][c].startsWith(color)) {
                moves.push({ row: r, col: c });
            }
        }
    }

    return moves;
}

// Initial Render
renderBoard();

// Timer start for white's first move
switchTimer("w");
